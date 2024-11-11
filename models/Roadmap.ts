// models/Roadmap.ts
import mongoose, { Schema, Document, Model } from "mongoose";

interface Resource {
  resource: string;
}

interface Subtopic {
  subtopic: string;
  resources: Resource[];
}

interface Topic {
  topic: string;
  subtopics: Subtopic[];
}

interface RoadmapDocument extends Document {
  topics: Topic[];
  category: string; // e.g., "JavaScript", "React", etc.
}

const ResourceSchema = new Schema<Resource>({
  resource: { type: String, required: true },
});

const SubtopicSchema = new Schema<Subtopic>({
  subtopic: { type: String, required: true },
  resources: [ResourceSchema],
});

const TopicSchema = new Schema<Topic>({
  topic: { type: String, required: true },
  subtopics: [SubtopicSchema],
});

const RoadmapSchema = new Schema<RoadmapDocument>({
  category: { type: String, required: true },
  topics: [TopicSchema],
});

const Roadmap = mongoose.model('Roadmap', RoadmapSchema, 'roadmaps');
export default Roadmap;
