import ThemeSetting from "../models/ThemeSetting.js";
import { catchError } from "../helper/service.js";
import { jsonStatus, status } from "../helper/api.responses.js";

// Returns the full theme settings payload for the mobile app
export const getAggregatedTheme = async (req, res) => {
  try {
    const theme = await ThemeSetting.findOne().lean();

    if (!theme) {
      return res.status(status.NotFound).json({
        success: false,
        status: jsonStatus.NotFound,
        message: "Theme settings not found",
        data: null,
      });
    }

    return res.status(status.OK).json({
      success: true,
      status: jsonStatus.OK,
      message: "Theme settings retrieved successfully",
      data: theme,
    });
  } catch (error) {
    catchError("getAggregatedTheme", error, req, res);
  }
};
