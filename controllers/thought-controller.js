const { Thought, User } = require('../models');

const thoughtController = {
//get all thoughts
  getThoughts(req, res) {
    Thought.find()
    .sort({ createdAt: -1 })
    .then((dbThoughtData) => res.json(dbThoughtData))
    .catch((err) => {
      console.log(err);
      res.sendStatus(500).json(err);
    });
  },

  //get a single thought with id
  getAThought(req, res) {
    Thought.findOne({ _id: req.params.id })
    .then((dbThoughtData) => {
      if (!dbThoughtData) {
        return res.status(404).json({ message: 'No thought associated with this id.' });
      }
      res.json(dbThoughtData);
    })
    .catch((err) => {
      console.log(err);
      res.sendStatus(500).json(err);
    });
  },

  //create a thought
  createThought(req, res) {
    Thought.create(req.body)
    .then((dbThoughtData) => {
      return User.findOneAndUpdate(
        { _id: req.body.id },
        { $push: { thoughts: dbThoughtData._id } },
        { new: true }
      );
    })
    .then((dbUserData) => {
      if (!dbUserData) {
        return res
          .status(404)
          .json({ message: 'Thought created, but no user associated with this id.' });
      }
      res.json({ message: 'Thought created sucessfully!' });
    })
    .catch((err) => {
      console.log(err);
      res.sendStatus(500).json(err);
    });
  },

  //update thought
  updateThought(req, res) {
    Thought.findOneAndUpdate(
      { _id: req.params.id },
      { $set: req.body },
      { new: true, runValidators: true }
    )
    .then((dbThoughtData) => {
      if (!dbThoughtData) {
        return res.status(404).json({ message: 'No thought associated with this id.' });
      }
      res.json(dbThoughtData);
    })
    .catch((err) => {
      console.log(err);
      res.sendStatus(500).json(err);
    });
  },

  //delete thought
  deleteThought(req, res) {
    Thought.findOneAndDelete({ _id: req.params.id })
    .then((dbThoughtData) => {
      if (!dbThoughtData) {
        return res.status(404).json({ message: 'No thought associated with this id.' });
      }
      return User.findOneAndUpdate(
        { thoughts: req.params.thoughtId },
        { $pull: { thoughts: req.params.thoughtId } },
        { new: true }
      );
    })
    .then((dbUserData) => {
      if (!dbUserData) {
        return res.status(404).json({ message: 'Thought created, but no user associated with this id.' });
      }
      res.json({ message: 'Thought deleted sucessfully.' });
    })
    .catch((err) => {
      console.log(err);
      res.sendStatus(500).json(err);
    });
  },

  //add reaction
  addReaction(req, res) {
    Thought.findOneAndUpdate(
      { _id: req.params.thoughtId },
      { $addToSet: { reactions: req.body } },
      { new: true, runValidators: true }
    )
    .then((dbThoughtData) => {
      if (!dbThoughtData) {
        return res.status(404).json({ message: 'No thought associated with this id.' });
      }
      res.json(dbThoughtData);
    })
    .catch((err) => {
      console.log(err);
      res.sendStatus(500).json(err);
    });
  },

  //remove reaction
  removeReaction(req, res) {
    Thought.findOneAndUpdate(
      { _id: req.params.thoughtId },
      { $pull: { reactions: { id: req.params.id } } },
      { new: true, runValidators: true }
    )
    .then((dbThoughtData) => {
      if (!dbThoughtData) {
        return res.status(404).json({ message: 'No thought associated with this id.' });
      }
      res.json(dbThoughtData);
    })
    .catch((err) => {
      console.log(err);
      res.sendStatus(500).json(err);
    });
  },
};

module.exports = thoughtController;