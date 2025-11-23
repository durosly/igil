import { Schema, model, models, Model } from "mongoose";

export interface IGalleryImage {
	_id?: string;
	title: string;
	description: string;
	imageUrl: string;
	fileSize?: number;
	thumbnailUrl?: string;
	order?: number;
	createdAt?: Date;
	updatedAt?: Date;
}

const GalleryImageSchema = new Schema<IGalleryImage>(
	{
		title: {
			type: String,
			required: [true, "Title is required"],
			trim: true,
			maxlength: [200, "Title cannot exceed 200 characters"],
		},
		description: {
			type: String,
			required: [true, "Description is required"],
			trim: true,
			maxlength: [1000, "Description cannot exceed 1000 characters"],
		},
		imageUrl: {
			type: String,
			required: [true, "Image URL is required"],
			trim: true,
		},
		thumbnailUrl: {
			type: String,
			trim: true,
		},
		fileSize: {
			type: Number,
			default: 0,
		},
		order: {
			type: Number,
			default: 0,
		},
	},
	{
		timestamps: true,
	}
);

// Create index for ordering
GalleryImageSchema.index({ order: 1, createdAt: -1 });

const GalleryImage: Model<IGalleryImage> = models.GalleryImage || model<IGalleryImage>("GalleryImage", GalleryImageSchema);

export default GalleryImage;
