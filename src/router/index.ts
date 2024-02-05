import { Router } from 'express';
import { withAuth } from '@utils';

import { userRouter } from '@domains/user';
import { postRouter } from '@domains/post';
import { authRouter } from '@domains/auth';
import { healthRouter } from '@domains/health';
import { followRouter } from '@domains/follow';
import { reactionRouter } from '@domains/reaction';
import { commentRouter } from '@domains/comment';

export const router = Router();

router.use('/health', healthRouter);
router.use('/auth/validate', withAuth, authRouter);
router.use('/auth', authRouter);
router.use('/follower', withAuth, followRouter);
router.use('/user', withAuth, userRouter);
router.use('/post', withAuth, postRouter);
router.use('/reaction', withAuth, reactionRouter);
router.use('/comment', withAuth, commentRouter);
