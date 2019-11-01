const path = require('path');
const fs = require('fs');
const Bagpipe = require('bagpipe');
const cheerio = require('cheerio');
const request = require('request-promise');

const bagpipe = new Bagpipe(10);

request({url: 'https://www.zhihu.com/question/314609358'}).then(body => {
  const $ = cheerio.load(body);
  const imgList = $('#QuestionAnswers-answers .List-item').eq(0).find('.RichContent-inner img');
  
  const imgSrcList = [];
  for (let i = 0; i < imgList.length; i++) {
    const src = imgList.eq(i).attr('data-original');
    if (src) imgSrcList.push(src);
  }

  imgSrcList.forEach((item, index) => {
    const destImg = path.resolve('./public', item.split('/')[item.split('/').length - 1]);

  	bagpipe.push(downloadImg, item, destImg, function(err, data) {
			console.log("["+ index++ +"]: " + data);
		});
  });
});

function downloadImg(src, dest, callback) {
	request.head(src, function(err, res, body) {
		if (src) {
			request(src).pipe(fs.createWriteStream(dest)).on('close', function() {
				callback(null, dest);
			});
		}
	});
};
