const express = require("express");
const {
  getVideo,
  getAllVideos,
  addVideo,
  updateVideo,
  deleteVideo,
  likeVideo,
  unlikeVideo,
  commentVideo,
  deleteComment,
  getComments
} = require("../Controllers/video.controller");

const router = express.Router();

// Add a video
router.post("/:id", addVideo);

// Get a video
router.get("/:id", getVideo);

// Get all videos
router.get("/", getAllVideos);

// Update video
router.put("/:id", updateVideo);

// Delete video
router.delete("/:id", deleteVideo);

// Like video
router.post("/:id/like", likeVideo);

// Unlike video
router.post("/:id/unlike", unlikeVideo);

// Comment on video
router.post("/:id/comment", commentVideo);

// Delete on video
router.delete("/:id/comment", deleteComment );

// Get all comments
router.get("/:id/comment", getComments);

module.exports = router;
