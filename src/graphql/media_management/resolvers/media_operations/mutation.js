import ResponseError from "../../../../error_handlers/response-error.js";
import { AllMedia } from "../../../../db/models/all-media.js";
import { catchAsync } from "../../../../utils/catchAsync.js";
import { nanoid } from "nanoid";
import {
  entityTypes,
  CloudFrontBaseUrl,
  S3BaseUrl,
  mediaProvider,
  cdnProvider,
} from "../../media.config.js";
import {
  getCloudFrontSignedUrl,
  putObjectUrl,
} from "../../../../services/aws.service.js";

const service = "MEDIA_MANAGEMENT";

const mediaMutations = {
  generateSignedUrl: catchAsync(
    async (
      _root,
      {
        entityType,
        entityId,
        fileExtension,
        mediaType,
        mediaSize,
        thumbnailExtension,
        thumbnailSize,
      },
      { userId, authError }
    ) => {
      const errorResponse = new ResponseError(true, 400);
      const successResponse = new ResponseError(false, 201);

      if (authError) {
        return {
          ...errorResponse,
          message: authError,
          errorCodeForClient: "error-generating-signed-url",
        };
      }

      if (!userId) {
        return {
          ...errorResponse,
          message: "Log in required",
          errorCodeForClient: "error-generating-signed-url",
        };
      }

      if (!entityTypes.includes(entityType)) {
        return {
          ...errorResponse,
          message: "Invalid enity type",
          errorCodeForClient: "inputParamValidationInGeneratingSignedUrl",
        };
      }

      if (entityType === "userProfilePicture" && !entityId) {
        return {
          ...errorResponse,
          message: "Entity Id is required",
          errorCodeForClient: "invalidEntityWhileGeneratingSignedUrl",
        };
      }

      let thumbnailSignedUrl = null;
      let thumbnailImageMediaId = null;
      let pathToSaveThumbnail = null;

      if (
        mediaType === "video" ||
        (mediaType === "image" && entityType !== "compressedFile")
      ) {
        thumbnailImageMediaId = nanoid(20);

        pathToSaveThumbnail = `thumbnail/${thumbnailImageMediaId}-thumbnail.${thumbnailExtension}`;
        thumbnailSignedUrl = await putObjectUrl(
          pathToSaveThumbnail,
          `image/${thumbnailExtension}`
        );

        const thumbnail = await AllMedia.create({
          mediaId: thumbnailImageMediaId,
          userId,
          fileName: `${thumbnailImageMediaId}-thumbnail.${thumbnailExtension}`,
          storageRelativePath: `https://${S3BaseUrl}/${pathToSaveThumbnail}`,
          mediaProvider,
          cdnProvider,
          cdnRelativePath: `https://${CloudFrontBaseUrl}/${pathToSaveThumbnail}`,
          mediaSize: thumbnailSize,
          fileExtension: thumbnailExtension,
        });
      }

      const mediaId = nanoid(20);
      const pathToSave = `${entityType}/${mediaId}-${entityType}.${fileExtension}`;
      const signedUrl = await putObjectUrl(
        pathToSave,
        `${mediaType}/${fileExtension}`
      );

      const media = await AllMedia.create({
        mediaId,
        userId,
        fileName: `${mediaId}-${entityType}.${fileExtension}`,
        storageRelativePath: `${S3BaseUrl}/${pathToSave}`,
        mediaProvider,
        cdnProvider,
        cdnRelativePath: `https://${CloudFrontBaseUrl}/${pathToSave}`,
        mediaSize,
        fileExtension,
        entityId,
        thumbnailImageFilePath: `https://${CloudFrontBaseUrl}/${pathToSaveThumbnail}`,
        thumbnailImageMediaId,
      });

      return {
        ...successResponse,
        message: "Signed Url Generated",
        mediaId,
        signedUrl,
        thumbnailSignedUrl,
        thumbnailImageMediaId,
      };
    },
    service
  ),

  getCDNSignedUrl: catchAsync(
    async (_root, { mediaId }, { userId, authError }) => {
      const errorResponse = new ResponseError(true, 400);
      const successResponse = new ResponseError(false, 201);

      if (authError) {
        return {
          ...errorResponse,
          message: authError,
          errorCodeForClient: "error-generating-signed-url",
        };
      }

      if (!userId) {
        return {
          ...errorResponse,
          message: "Log in required",
          errorCodeForClient: "error-generating-signed-url",
        };
      }

      const media = await AllMedia.findOne({ mediaId });

      if (!media) {
        return {
          ...errorResponse,
          message: "No media found",
          errorCodeForClient: "media-not-found",
        };
      }

      if (media.mediaStatus !== "published") {
        return {
          ...errorResponse,
          message: "This media is not published yet.",
          errorCodeForClient: "error-generating-signed-url",
        };
      }

      console.log(media.cdnRelativePath);
      const signedUrl = await getCloudFrontSignedUrl(media.cdnRelativePath);

      return {
        ...successResponse,
        message: "This signed url is valid for 7 Days",
        signedUrl,
      };
    },
    service
  ),
  markMedia: catchAsync(
    async (_root, { mediaId, mediaStatus }, { authError, userId }) => {
      const errorResponse = new ResponseError(true, 400);
      const successResponse = new ResponseError(false, 201);

      if (authError) {
        return {
          ...errorResponse,
          message: authError,
          errorCodeForClient: "error--signed-url",
        };
      }

      if (!userId) {
        return {
          ...errorResponse,
          message: "Log in required",
          errorCodeForClient: "error-generating-signed-url",
        };
      }

      const media = await AllMedia.findOne({ mediaId });

      media.mediaStatus = mediaStatus;
      await media.save();

      return {
        ...successResponse,
        message: "Media status updated",
        mediaId,
        mediaStatus: media.mediaStatus,
      };
    },
    service
  ),
};

export default mediaMutations;
