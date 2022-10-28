const Goal = require('../models/goalModel');
const User = require('../models/userModel');

// @desc Get goals
// @route GET / api / goals
// @access Private
const getGoals = async (req, res) =>
{
    const goals = await Goal.find({user:req.user.id});
    res.status(200).json(goals);
}

// @desc Set goals
// @route POST / api / goals
// @access Private
const setGoal = async (req, res) =>
{
    if (!req.body.text)
    {
        res.status(400).json({ message: "Please enter a valid text message" });
    }

    const goal = await Goal.create({
        text: req.body.text,
        user:req.user.id,
    })

    res.status(200).json(goal);
}

// @desc Update goals
// @route PUT / api / goals/:id
// @access Private
const updateGoal = async (req, res) => {
    const goal = await Goal.findById(req.params.id);
    if (!goal)
    {
        res.status(400).json({ error: 'Goal not found' });
    }

    const user = await User.findById(req.user.id);

    //check if user exists
    if (!user)
    {
        res.status(401).json({ error: "User not found" });
    }

    //make sure the logged and user matches the log user
    if (goal.user.toString() !== user.id)
    {
        res.status(401).json({ error: "User not authorized" });
    }

    const updatedGoal = await Goal.findByIdAndUpdate(req.params.id, req.body, { new: true });

    res.status(200).json(updatedGoal);
}

// @desc Delete goals
// @route DELETE / api / goals / :id
// @access Private
const deleteGoal = async (req, res) =>
{
    const goal = await Goal.findById(req.params.id);
    if (!goal)
    {
        res.status(400).json({ error: 'Goal not found' });
    }

    const user = await User.findById(req.user.id);

    //check if user exists
    if (!user)
    {
        res.status(401).json({ error: "User not found" });
    }

    //make sure the logged and user matches the log user
    if (goal.user.toString() !== user.id)
    {
        res.status(401).json({ error: "User not authorized" });
    }
    
    await goal.remove();
    res.status(200).json({ id: req.params.id });
}
module.exports = { getGoals, setGoal, updateGoal, deleteGoal };