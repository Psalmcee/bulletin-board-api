import { Router } from "express";
import { forgotPassword, resetPassword, getResetToken } from "../controller";

export const router = Router()

router.route('/forgot-password').post(forgotPassword);
router.route('/reset-password/:token').get(getResetToken);
 router.route('/reset-password/:token').post(resetPassword);
