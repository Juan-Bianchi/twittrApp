import { Router } from 'express'
import { withAuth } from '@utils'

import { userRouter } from '@domains/user'
import { postRouter } from '@domains/post'
import { authRouter } from '@domains/auth'
import { healthRouter } from '@domains/health'
import { followRouter } from '@domains/follow'

export const router = Router()

router.use('/health', healthRouter)
router.use('/auth', authRouter)
router.use('/follower', followRouter)
router.use('/user', withAuth, userRouter)
router.use('/post', withAuth, postRouter)
