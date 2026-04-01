import express from 'express';

router.post('/register', usersController.registerUser);

router.post('/login', usersController.login);

export default router;