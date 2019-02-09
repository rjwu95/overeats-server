const express = require('express');
const mongoose = require('mongoose');

const router = express.Router();

/* Menu category */
router.get('/:category', (req, res) => {
  let { category } = req.params;
  console.log(category);
});

module.exports = router;

//한식
//분식
//돈까스,회,일식
//치킨
//피자
//중국집
//족발.보쌈
//야식
//찜,탕
//도시락
//카페, 디저트
//패스트푸드
//프랜차이즈
