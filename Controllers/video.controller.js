const User = require("../Models/user.model");
const Video = require("../Models/video.model");
const createError = require("../error");

const addVideo = async (req, res, next) => {
  try {
    const { title, description, tags, fileUrl } = req.body;
    const user = await User.findById(req.params.id);
    if (!user) return next(createError(404, "User not found!"));

    const newVideo = new Video({
      title,
      description,
      tags: tags.split(",").map((tag) => tag.trim()),
      fileUrl,
      owner: user._id,
    });

    await newVideo.save();
    res
      .status(201)
      .json({ message: "Video uploaded successfully", video: newVideo });
  } catch (err) {
    next(err);
  }
};

const updateVideo = async (req, res, next) => {
    try {
      const video = await Video.findById(req.params.id);
      if (!video) return next(createError(404, "Video not found!"));
      
        const updatedVideo = await Video.findByIdAndUpdate(
          req.params.id,
          {
            $set: req.body,
          },
          { new: true }
        );
        res.status(200).json(updatedVideo);
    } catch (err) {
      next(err);
    }
  };

const deleteVideo = async (req, res, next) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) return next(createError(404, "User not found!"));

    const video = await Video.findById(req.body.vid);
    if (!video) return next(createError(404, "Video not found!"));

    if (video.owner.toString() !== user._id.toString()) {
      return next(
        createError(403, "You don't have permission to delete this video")
      );
    }

    await Video.findByIdAndDelete(req.body.vid);
    res.status(200).json("The video has been deleted.");
  } catch (err) {
    next(err);
  }
};

const likeVideo = async (req, res, next) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) return next(createError(404, "User not found!"));

    const video = await Video.findById(req.body.vid);
    if (!video) return next(createError(404, "Video not found!"));

    if (video.likes.includes(user._id)) {
      return next(createError(400, "You have already liked this video"));
    }

    video.likes.push({ user: user._id });
    await video.save();

    res.status(200).json("Video liked");
  } catch (err) {
    next(err);
  }
};

const unlikeVideo = async (req, res, next) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) return next(createError(404, "User not found!"));

    const video = await Video.findById(req.body.vid);
    if (!video) return next(createError(404, "Video not found!"));

    const likeIndex = video.likes.findIndex(
      (like) => like.user.toString() === user._id.toString()
    );
    if (likeIndex === -1) {
      return next(createError(400, "You have not liked this video"));
    }

    video.likes.splice(likeIndex, 1);
    await video.save();

    res.status(200).json("Video unliked");
  } catch (err) {
    next(err);
  }
};

const commentVideo = async (req, res, next) => {
  try {
    const { text } = req.body;

    const user = await User.findById(req.params.id);
    if (!user) return next(createError(404, "User not found!"));

    const video = await Video.findById(req.body.vid);
    if (!video) return next(createError(404, "Video not found!"));

    const newComment = {
      user: user._id,
      text: text,
      createdAt: Date.now(),
    };

    video.comments.push(newComment);
    await video.save();

    res
      .status(200)
      .json({ message: "Comment added successfully", comment: newComment });
  } catch (err) {
    next(err);
  }
};

const deleteComment = async (req, res, next) => {
  try {
    const { commentId } = req.body;

    const user = await User.findById(req.params.id);
    if (!user) return next(createError(404, "User not found!"));

    const video = await Video.findById(req.body.vid);
    if (!video) return next(createError(404, "Video not found!"));

    const commentIndex = video.comments.findIndex(
      (comment) => comment._id.toString() === commentId.toString()
    );

    if (commentIndex === -1) {
      return next(createError(404, "Comment not found"));
    }

    if (video.comments[commentIndex].user.toString() !== user._id.toString()) {
      return next(
        createError(403, "You do not have permission to delete this comment")
      );
    }

    video.comments.splice(commentIndex, 1);
    await video.save();

    res.status(200).json({ message: "Comment deleted successfully" });
  } catch (err) {
    next(err);
  }
};

const getComments = async (req, res, next) => {
  try {
    const video = await Video.findById(req.params.id)
    .populate("comments.user", "username");
    if (!video) return next(createError(404, "Video not found!"));

    res.status(200).json({ comments: video.comments });
  } catch (error) {
    next(error);
  }
};

const getAllVideos = async (req, res, next) => {
  try {
    const { search, tags, sortBy, orderBy, owner } = req.query;

    let filter = {};

    if (search) {
      filter.title = { $regex: search, $options: "i" };
    }

    if (tags) {
      const tagArray = tags.split(",").map((tag) => tag.trim().toLowerCase());
      filter.tags = { $in: tagArray };
    }

    if (owner) {
      filter.owner = owner;
    }

    let videosQuery = Video.find(filter);

    if (sortBy) {
      const sortOrder = orderBy === "asc" ? 1 : -1;
      videosQuery = videosQuery.sort({ [sortBy]: sortOrder });
    }

    const videos = await videosQuery;
    res.status(200).json({ videos });
  } catch (err) {
    next(err);
  }
};

const getVideo = async (req, res, next) => {
  try {
    const video = await Video.findById(req.params.id);
    res.status(200).json(video);
  } catch (err) {
    next(err);
  }
};

module.exports = {
  addVideo,
  updateVideo,
  deleteVideo,
  likeVideo,
  unlikeVideo,
  commentVideo,
  deleteComment,
  getComments,
  getAllVideos,
  getVideo,
};
