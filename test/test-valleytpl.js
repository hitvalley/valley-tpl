var vtpl = require('./valleytpl');

// console.log(vtpl);

// vtpl.getTplContent('./template.html').then(function(tpl){
//   console.log(tpl);
// });

var template = './template.html';
try {
  vtpl(template, {
    header: 'searcher list',
    list: ['baidu', 'sogou', '360', 'google']
  }, {
    author: 'gutianyu'
  }).then(function(html){
    console.log(html);
  });
} catch(e) {
  console.log(e)
}
// .then(function(tplObj){
//   console.log(tplObj);
// });

process.on('uncaughtException', function(err) {
  console.trace()
});