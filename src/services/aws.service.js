import {
  S3Client,
  GetObjectCommand,
  PutObjectCommand,
} from "@aws-sdk/client-s3";
import { getSignedUrl as getSignedUrlS3 } from "@aws-sdk/s3-request-presigner";
import { getSignedUrl as getSignedUrlCloudFront } from "@aws-sdk/cloudfront-signer";

const s3client = new S3Client({
  region: process.env.AWS_BUCKET_REGION,
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_CODE,
    secretAccessKey: process.env.AWS_SECRET_KEY,
  },
});

export async function putObjectUrl(key, contentType) {
  const command = new PutObjectCommand({
    Bucket: process.env.AWS_BUCKET_NAME,
    Key: key,
    ContentType: contentType,
  });

  const url = await getSignedUrlS3(s3client, command);

  return url;
}

export async function getCloudFrontSignedUrl(url) {
  const Signedurl = await getSignedUrlCloudFront({
    url,
    dateLessThan: new Date(Date.now() + 1000 * 60 * 60 * 24 * 7),
    privateKey: process.env.AWS_CLOUDFRONT_PRIVATE_KEY,
    keyPairId: process.env.AWS_CLOUDFRONT_KEY_PAIR,
  });

  return Signedurl;
}

//Getting SignedURL for S3 bucket
// export async function getObjectUrl(key) {
//   const command = new GetObjectCommand({
//     Bucket: "namaskar-jyotishi-test",
//     Key: key,
//   });

//   const url = await getSignedUrlCloudFrontS3(s3client, command);

//   return url;
// }
