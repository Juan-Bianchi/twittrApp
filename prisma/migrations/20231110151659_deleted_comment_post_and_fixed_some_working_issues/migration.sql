/*
  Warnings:

  - You are about to drop the `CommentPost` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "CommentPost" DROP CONSTRAINT "CommentPost_commentId_fkey";

-- DropForeignKey
ALTER TABLE "CommentPost" DROP CONSTRAINT "CommentPost_postId_fkey";

-- AlterTable
ALTER TABLE "Post" ADD COLUMN     "postCommentedId" UUID;

-- DropTable
DROP TABLE "CommentPost";

-- AddForeignKey
ALTER TABLE "Post" ADD CONSTRAINT "Post_postCommentedId_fkey" FOREIGN KEY ("postCommentedId") REFERENCES "Post"("id") ON DELETE CASCADE ON UPDATE CASCADE;
