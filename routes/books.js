const express = require('express');
const router = express.Router();

router.use(express.json())

router.get('/', (req, res) => {
    res.json('전체 도서 조회');
});


router.get('/:id', (req, res) => {
    res.json('개별 도서 조회');
});

router.get('/', (req, res) => {
    res.json('카테고리별 신간 도서 조회');
});

module.exports = router;