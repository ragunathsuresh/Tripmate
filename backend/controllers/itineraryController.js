const Itinerary = require('../models/Itinerary');
const Destination = require('../models/Destination');
const Trip = require('../models/Trip');

// @desc    Get itinerary by trip ID
// @route   GET /api/itinerary/:tripId
// @access  Private
const getItinerary = async (req, res) => {
    try {
        const itinerary = await Itinerary.findOne({ trip: req.params.tripId })
            .populate('destination')
            .populate({
                path: 'trip',
                populate: { path: 'user', select: 'name email' }
            });

        if (!itinerary) {
            return res.status(404).json({ message: 'Itinerary not found' });
        }

        res.status(200).json(itinerary);
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

// @desc    Regenerate activities for a specific day
// @route   POST /api/itinerary/regenerate-day
// @access  Private
const regenerateDay = async (req, res) => {
    const { tripId, dayNumber } = req.body;

    try {
        const itinerary = await Itinerary.findOne({ trip: tripId }).populate('destination');
        if (!itinerary) {
            return res.status(404).json({ message: 'Itinerary not found' });
        }

        const destination = itinerary.destination;
        const availableActivities = destination.activities || [];

        if (availableActivities.length === 0) {
            return res.status(400).json({ message: 'No activities available for this destination to regenerate.' });
        }

        // Simple regeneration: pick different activities based on dayNumber and random offset
        const newActivities = [];
        const offset = Math.floor(Math.random() * availableActivities.length);

        const morningAct = availableActivities[(dayNumber + offset) % availableActivities.length];
        const afternoonAct = availableActivities[(dayNumber + offset + 1) % availableActivities.length];
        const eveningAct = availableActivities[(dayNumber + offset + 2) % availableActivities.length];

        newActivities.push({
            time: '09:00 AM',
            activity: morningAct.title,
            location: destination.city,
            duration: '2 Hours',
            description: morningAct.description,
            type: morningAct.type
        });

        newActivities.push({
            time: '01:00 PM',
            activity: afternoonAct.title,
            location: destination.city,
            duration: '3 Hours',
            description: afternoonAct.description,
            type: afternoonAct.type
        });

        newActivities.push({
            time: '07:00 PM',
            activity: eveningAct.title,
            location: destination.city,
            duration: '2 Hours',
            description: eveningAct.description,
            type: eveningAct.type
        });

        // Update the specific day
        const dayIndex = itinerary.days.findIndex(d => d.dayNumber === Number(dayNumber));
        if (dayIndex !== -1) {
            itinerary.days[dayIndex].activities = newActivities;
        } else {
            itinerary.days.push({ dayNumber: Number(dayNumber), activities: newActivities });
        }

        await itinerary.save();
        res.status(200).json(itinerary);
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

// @desc    Add custom activity to a day
// @route   POST /api/itinerary/add-activity
// @access  Private
const addActivity = async (req, res) => {
    const { tripId, dayNumber, activityTitle, location, time, duration, notes, type } = req.body;

    try {
        const itinerary = await Itinerary.findOne({ trip: tripId });
        if (!itinerary) {
            return res.status(404).json({ message: 'Itinerary not found' });
        }

        const newActivity = {
            activity: activityTitle,
            location,
            time,
            duration,
            notes,
            type: type || 'custom'
        };

        const dayIndex = itinerary.days.findIndex(d => d.dayNumber === Number(dayNumber));
        if (dayIndex !== -1) {
            itinerary.days[dayIndex].activities.push(newActivity);
        } else {
            itinerary.days.push({
                dayNumber: Number(dayNumber),
                activities: [newActivity]
            });
        }

        await itinerary.save();
        res.status(201).json(itinerary);
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

// @desc    Update an activity
// @route   PUT /api/itinerary/update-activity
// @access  Private
const updateActivity = async (req, res) => {
    const { tripId, dayNumber, activityId, updates } = req.body;

    try {
        const itinerary = await Itinerary.findOne({ trip: tripId });
        if (!itinerary) {
            return res.status(404).json({ message: 'Itinerary not found' });
        }

        const day = itinerary.days.find(d => d.dayNumber === Number(dayNumber));
        if (!day) return res.status(404).json({ message: 'Day not found' });

        const activity = day.activities.id(activityId);
        if (!activity) return res.status(404).json({ message: 'Activity not found' });

        Object.assign(activity, updates);
        await itinerary.save();

        res.status(200).json(itinerary);
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

// @desc    Delete an activity
// @route   DELETE /api/itinerary/delete-activity
// @access  Private
const deleteActivity = async (req, res) => {
    const { tripId, dayNumber, activityId } = req.body;

    try {
        const itinerary = await Itinerary.findOne({ trip: tripId });
        if (!itinerary) {
            return res.status(404).json({ message: 'Itinerary not found' });
        }

        const day = itinerary.days.find(d => d.dayNumber === Number(dayNumber));
        if (!day) return res.status(404).json({ message: 'Day not found' });

        day.activities.pull({ _id: activityId });
        await itinerary.save();

        res.status(200).json(itinerary);
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

module.exports = {
    getItinerary,
    regenerateDay,
    addActivity,
    updateActivity,
    deleteActivity
};
