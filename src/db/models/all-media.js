import mongoose from "mongoose";
const { Schema, model } = mongoose;

const AllMediaSchema = new Schema(
  {
    mediaId: {
      type: String,
    },
    userId: {
      type: String,
    },
    fileName: {
      type: String,
    },
    storageRelativePath: {
      type: String,
    },
    mediaProvider: {
      type: String,
    },
    cdnProvider: {
      type: String,
    },
    cdnRelativePath: {
      type: String,
    },
    mediaType: {
      type: String,
    },
    mediaSize: {
      type: Number,
    },
    fileExtension: {
      type: String,
    },
    entityId: {
      type: String,
    },
    entityType: {
      type: String,
    },
    compressedFilePath: {
      type: String,
    },
    compressedFileMediaId: {
      type: String,
    },
    thumbnailImageFilePath: {
      type: String,
      default: null,
    },
    thumbnailImageMediaId: {
      type: String,
      default: null,
    },
    mediaStatus: {
      type: String,
      enum: ["signedUrlGenerated", "published", "unpublished"],
      default: "signedUrlGenerated",
    },
  },
  { timestamps: true }
);
AllMediaSchema.index({ mediaId: 1 });
const AllMedia = model("AllMedia", AllMediaSchema);
export { AllMedia };
