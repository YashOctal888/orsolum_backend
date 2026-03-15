import Joi from "joi";
import ThemePoster from "../../models/ThemePoster.js";
import {uploadImageToS3} from "../../helper/s3Uploader.js";

const posterValidation = {
    create: Joi.object({
        name: Joi.string().required().trim(),
        active: Joi.boolean().default(false)
    }),
    toggle: Joi.object({
        id: Joi.string().hex().length(24).required()
    })
};

const index = async (req, res) => {
    try {
        const posters = await ThemePoster.find().sort({ createdAt: -1 });
        return res.status(200).json({ success: true, data: posters });
    } catch (error) {
        return res.status(500).json({ success: false, message: error.message });
    }
};

const create = async (req, res) => {
    try {
        const { error } = posterValidation.create.validate(req.body);
        if (error) return res.status(400).json({
            message: error.details[0].message
        });

        if (!req.file) return res.status(400).json({ message: "Poster image is required" });

        const isActive = req.body.active === 'true' || req.body.active === true || false;

        const poster = uploadImageToS3(req.file)

        const newPoster = await ThemePoster.create({
            name: req.body.name,
            poster,
            active: isActive
        });

        if (isActive) {
            await ThemePoster.updateMany(
                { _id: { $ne: newPoster._id } },
                { $set: { active: false } }
            );
        }

        return res.status(201).json({ success: true, data: newPoster });
    } catch (error) {
        return res.status(500).json({ success: false, message: error.message });
    }
};

const selectPoster = async (req, res) => {
    try {
        const { id } = req.params;

        await ThemePoster.updateMany({}, { $set: { active: false } });

        const updated = await ThemePoster.findByIdAndUpdate(
            id,
            { $set: { active: true } },
            { new: true }
        );

        if (!updated) return res.status(404).json({ message: "Poster not found" });

        return res.status(200).json({
            success: true,
            message: "Poster activated successfully",
            data: updated
        });
    } catch (error) {
        return res.status(500).json({ success: false, message: error.message });
    }
};

const destroy = async (req, res) => {
    try {
        const poster = await ThemePoster.findById(req.params.id);
        if (!poster) return res.status(404).json({ message: "Poster not found" });

        // Note: You should call your S3 delete utility here using poster.poster URL

        await poster.deleteOne();
        return res.status(200).json({ success: true, message: "Poster deleted successfully" });
    } catch (error) {
        return res.status(500).json({ success: false, message: error.message });
    }
};


export default {
    index,
    create,
    selectPoster,
    delete: destroy
};