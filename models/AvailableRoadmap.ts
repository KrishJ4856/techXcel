import mongoose from 'mongoose';

const AvailableRoadmapSchema = new mongoose.Schema({
  roadmaps: {
    skill: [String],
    role: [String],
  },
});

const AvailableRoadmap = mongoose.model('AvailableRoadmap', AvailableRoadmapSchema, 'availableRoadmaps');

export default AvailableRoadmap;
