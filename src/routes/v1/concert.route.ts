import express from 'express';
import { concertController } from '../../controllers';
import multer from 'multer';

const router = express.Router();
const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

router.route('/createConcert').post(upload.single('image'), concertController.createConcert);
router.route('/getConcerts').get(concertController.getConcerts);
router.route('/getConcert/:concertId').get(concertController.getConcert);
router.route('/deleteConcert/:concertId').delete(concertController.deleteConcert);
router.route('/updateConcert/:concertId').put(upload.single('image'), concertController.updateConcert);

export default router;

/**
 * @swagger
 * tags:
 *   name: Concerts
 *   description: Concert management and retrieval
 */

/**
 * @swagger
 * components:
 *   schemas:
 *     Concert:
 *       type: object
 *       properties:
 *         id:
 *           type: string
 *           format: uuid
 *         title:
 *           type: string
 *         location:
 *           type: string
 *         date:
 *           type: string
 *           format: date-time
 *         maxSeats:
 *           type: integer
 *         status:
 *           type: string
 *         image:
 *           type: string
 *           format: binary
 *         deletedAt:
 *           type: string
 *           format: date-time
 *           nullable: true
 *         createdAt:
 *           type: string
 *           format: date-time
 *         updatedAt:
 *           type: string
 *           format: date-time
 */

/**
 * @swagger
 * /concert/createConcert:
 *   post:
 *     summary: Create a concert
 *     description: Create a new concert with an optional image.
 *     tags: [Concerts]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             required:
 *               - title
 *               - location
 *               - date
 *               - maxSeats
 *               - status
 *             properties:
 *               title:
 *                 type: string
 *               location:
 *                 type: string
 *               date:
 *                 type: string
 *                 format: date-time
 *               maxSeats:
 *                 type: integer
 *               status:
 *                 type: string
 *               image:
 *                 type: string
 *                 format: binary
 *     responses:
 *       "201":
 *         description: Created
 *         content:
 *           application/json:
 *             schema:
 *                $ref: '#/components/schemas/Concert'
 *       "400":
 *         description: Bad request
 */

/**
 * @swagger
 * /concert/getConcerts:
 *   get:
 *     summary: Get all concerts
 *     description: Retrieve all concerts.
 *     tags: [Concerts]
 *     responses:
 *       "200":
 *         description: OK
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Concert'
 */

/**
 * @swagger
 * /concert/getConcert/{concertId}:
 *   get:
 *     summary: Get a concert
 *     description: Retrieve a concert by ID.
 *     tags: [Concerts]
 *     parameters:
 *       - in: path
 *         name: concertId
 *         required: true
 *         schema:
 *           type: string
 *         description: Concert ID
 *     responses:
 *       "200":
 *         description: OK
 *         content:
 *           application/json:
 *             schema:
 *                $ref: '#/components/schemas/Concert'
 *       "404":
 *         description: Concert not found
 */

/**
 * @swagger
 * /concert/deleteConcert/{concertId}:
 *   delete:
 *     summary: Delete a concert
 *     description: Logically delete a concert by ID.
 *     tags: [Concerts]
 *     parameters:
 *       - in: path
 *         name: concertId
 *         required: true
 *         schema:
 *           type: string
 *         description: Concert ID
 *     responses:
 *       "200":
 *         description: No content
 *       "404":
 *         description: Concert not found
 */

/**
 * @swagger
 * /concert/updateConcert/{concertId}:
 *   put:
 *     summary: Update a concert
 *     description: Update an existing concert by ID. Fields that are not provided will retain their current values.
 *     tags: [Concerts]
 *     parameters:
 *       - in: path
 *         name: concertId
 *         required: true
 *         schema:
 *           type: string
 *         description: Concert ID
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               title:
 *                 type: string
 *               location:
 *                 type: string
 *               date:
 *                 type: string
 *                 format: date-time
 *               maxSeats:
 *                 type: integer
 *               status:
 *                 type: string
 *               image:
 *                 type: string
 *                 format: binary
 *     responses:
 *       "200":
 *         description: OK
 *         content:
 *           application/json:
 *             schema:
 *                $ref: '#/components/schemas/Concert'
 *       "404":
 *         description: Concert not found
 */
