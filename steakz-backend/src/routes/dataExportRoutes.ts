import { Router } from 'express';
import { startExport, getExportStatus, downloadExportFile } from '../controllers/dataExportController';
import { authenticateToken, authorizeRole } from '../middleware/authMiddleware';
import { Role } from '@prisma/client';

const router = Router();

router.post('/start',
	authenticateToken,
	authorizeRole([Role.ADMIN, Role.GENERAL_MANAGER, Role.BRANCH_MANAGER]),
	(req, res, next) => { startExport(req, res).catch(next); }
);
router.get('/status/:jobId',
	authenticateToken,
	authorizeRole([Role.ADMIN, Role.GENERAL_MANAGER, Role.BRANCH_MANAGER]),
	(req, res, next) => { getExportStatus(req, res).catch(next); }
);
router.get('/download/:jobId',
	authenticateToken,
	authorizeRole([Role.ADMIN, Role.GENERAL_MANAGER, Role.BRANCH_MANAGER]),
	(req, res, next) => { downloadExportFile(req, res).catch(next); }
);

export default router;