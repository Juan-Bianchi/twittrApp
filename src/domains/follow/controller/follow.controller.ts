import { Request, Response, Router } from 'express'
import HttpStatus from 'http-status'
// express-async-errors is a module that handles async errors in express, don't forget import it in your new controllers
import 'express-async-errors'

import { db } from '@utils'

export const followRouter = Router();

followRouter.post('/follow/:user_id', async (req: Request, res: Response) => {
    res.send('pasando por post follow by id! si')
})

followRouter.post('/unfollow/:user_id', async (req:Request, res: Response) => {
    res.send('pasando por post unfollow by id')
} )





