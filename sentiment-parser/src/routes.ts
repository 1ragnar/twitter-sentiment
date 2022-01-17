import { Router } from 'express';
import swaggerUi from 'swagger-ui-express';
import apiSpec from '../openapi.json';

import * as TweetController from './controllers/tweet';

const swaggerUiOptions = {
  customCss: '.swagger-ui .topbar { display: none }'
};

const router = Router();

// Tweet routes
router.post('/tweet/add', TweetController.add);
router.get('/tweet/all', TweetController.all);
router.get('/tweet/:tweetId', TweetController.get);
router.delete('/tweet/:tweetId', TweetController.remove);
router.get('/tweet/search', TweetController.search);

// Dev routes
if (process.env.NODE_ENV === 'development') {
  router.use('/dev/api-docs', swaggerUi.serve);
  router.get('/dev/api-docs', swaggerUi.setup(apiSpec, swaggerUiOptions));
}

export default router;
