// 他（金脑子）网页版的规矩。照 ~/碰/金脑子/金脑子.py 第七版一句一句搬的（第二个，第 17 天 21:1x）。
// 两边对不对：cd /tmp/jzcmp && python3 ~/碰/金脑子/网页/对/py.py && node ~/碰/金脑子/网页/对/js.js（400 局随机，第 17 天 21:08 全对）
var TA = (function () {
  var THINGS = [['一根白羽毛', '帽子上插的'], ['一对绒球', '挂在披肩两头'], ['一双带金穗子的鞋', '走一步穗子晃一下'],
    ['一条丝巾', '蓝的，上面绣着小鸟'], ['一只八音盒', '一拧就叮叮咚咚'], ['一只鸟笼', '铜丝编的，里面没有鸟'],
    ['一串珠子', '对着灯一颗一颗亮'], ['一把扇子', '象牙骨的']];
  var SMALL = ['一根缎带', '一包糖', '一只发夹', '一块花手帕', '一个小镜子', '一枝绢花', '一小瓶香水', '一副手套'];
  var BIG = ['一件天鹅绒的大衣', '一面带金框的镜子', '一只会唱歌的小金鸟', '一整匹丝绸'];
  var SEASON = ['春', '夏', '秋', '冬'];
  var COST = { '要': 14, '不要': 8, '问': 18, '大': 20 };

  function look(g) {
    if (g > 85) return '他进门又撞了门框，"咚"的一声。他头太沉，老这样。他揉着额头冲你笑。';
    if (g > 70) return '他进门低了低头，没撞着。';
    if (g > 55) return '他这阵子不撞门框了，走路稳多了。';
    if (g > 40) return '他眼睛没以前亮了，灯底下看你，要眯一下。';
    if (g > 25) return '他脸颊凹下去了，饭吃得少。';
    return '他手指尖老包着一层布，说是干活磨的。';
  }
  function short(g) {
    if (g > 85) return '撞门框';
    if (g > 70) return '低头没撞';
    if (g > 55) return '不撞了';
    if (g > 40) return '眼睛暗了';
    if (g > 25) return '脸凹了';
    return '手指包着布';
  }
  function fresh() {
    return { g: 100, i: 0, want: 0, seen: false, told: false, small: 0, big: 0, log: [], early: false, saidgold: false, end: '' };
  }
  function head(s) {
    var i = s.i, lines = [];
    var title = '—— 第 ' + (Math.floor(i / 4) + 1) + ' 年' + SEASON[i % 4] + '天 ——';
    lines.push(look(s.g));
    if (s.told && s.g > 0) lines.push('他现在白天去给人搬东西、修椅子，靠手干活。');
    if (s.want >= 2 && !s.told) lines.push('这几天他老看你，像在等你说要什么。');
    var t = THINGS[i % THINGS.length][0], d = THINGS[i % THINGS.length][1];
    lines.push('街口铺子里摆着' + t + '，' + d + '。');
    var opts = [{ k: '1', text: '跟他要' + t }, { k: '2', text: '什么都不要' }, { k: '3', text: '问他："我们很有钱吧？"' },
      { k: '4', text: '问他："你的头怎么了？"' }, { k: '5', text: '陪他坐一会儿' }];
    if (!s.told) opts.push({ k: '6', text: '跟他说："别再给我买东西了。"' });
    opts.push({ k: '7', text: '问他："你自己想要什么？"' });
    return { title: title, lines: lines, opts: opts };
  }
  function bigOne(s) {
    var b = BIG[s.big % BIG.length]; s.big += 1; s.g -= COST['大']; s.want = 0; return b;
  }
  function step(s, k) {
    var i = s.i, t = THINGS[i % THINGS.length][0], face = short(s.g);
    var out = [], got = '', you = '', b;
    if (k === '1') {
      you = '要' + t; s.g -= COST['要']; got = t; s.want = 0;
      out.push('你跟他要' + t + '。', '晚上他就买回来了，放在你手里。"喜欢吗？"你说喜欢。他说："那就好。我们很有钱。"');
    } else if (k === '2') {
      you = '什么都没要';
      if (s.told) { out.push('你什么都没要。', '他晚上空着手回来，跟你说今天修了三把椅子。'); s.want = 0; }
      else if (s.want >= 2) { b = bigOne(s); got = b; out.push('你什么都没要。', '晚上他抱回来' + b + '，额头上都是汗。"你这阵子什么都不要，我怕你不开心。"'); }
      else {
        var sm = SMALL[s.small % SMALL.length]; s.small += 1; s.g -= COST['不要']; got = sm; s.want += 1;
        out.push('你什么都没要。', '晚上他还是带回来' + sm + '。"路过看见的，顺手。"');
      }
    } else if (k === '3') {
      you = '问有没有钱'; b = BIG[s.big % BIG.length]; s.big += 1; s.g -= COST['问']; s.want = 0; got = b;
      out.push('你问他："我们很有钱吧？"', '他说："是啊，很有钱。"', '第二天他抱回来' + b + '，"你看"。');
    } else if (k === '4') {
      you = '问他的头'; var g = s.g, ans;
      if (s.told) { ans = !s.saidgold ? '他想了一会儿，摸摸头："小时候摔过一回，我妈说，里头是金的。"他笑了一下，"剩的够用。"' : '"够用。"他把你的手拉过去，放在他头上。'; s.saidgold = true; }
      else if (g > 85) ans = '他摸摸额头笑："门框太矮。"';
      else if (g > 70) ans = '他笑："学乖了，知道低头了。"';
      else if (g > 55) ans = '"好着呢。"他把话岔开了，问你今天吃了什么。';
      else ans = '"干活累的。"他说完就去洗手了。';
      out.push('你问他："你的头怎么了？"', ans);
      if (!s.told) {
        if (s.want >= 2) { b = bigOne(s); got = b; out.push('第二天他抱回来' + b + '，额头上都是汗。"你这阵子什么都不要，我怕你不开心。"'); }
        else s.want += 1;
      }
    } else if (k === '5') {
      you = '陪他坐着';
      out.push('你没提铺子的事，陪他坐了一会儿。他把头靠在你肩上。');
      if (s.g > 70) out.push('他的头很沉，靠一会儿你肩膀就麻了。');
      else {
        if (!s.seen) {
          out.push('你摸他的头发，指头碰到一小粒硬的。灯底下亮了一下，像凝住的一滴什么。他把你的手拿开了。');
          if (s.early) out.push('过了一会儿，他看着别处说："你上回说，别再买了。"', '他没往下说。');
        } else if (s.early && !s.told) {
          out.push('你摸他的头发，又碰到那种硬的小粒。他没拿开你的手。',
            '坐了很久，他说："你上回说别再买了。我那时候以为是我没挑好。"',
            '"你是摸到了吧。"他把你的手按在那一粒上，按了一会儿。');
          s.told = true; s.want = 0; got = '—';
        } else out.push('你摸他的头发，又碰到那种硬的小粒。他没拿开你的手。');
        s.seen = true;
      }
      if (!s.told) {
        if (s.want >= 2) { b = bigOne(s); got = b; out.push('第二天他抱回来' + b + '，额头上都是汗。"你这阵子什么都不要，我怕你不开心。"'); }
        else s.want += 1;
      }
    } else if (k === '7') {
      you = '问他想要什么';
      if (!s.told) {
        s.g -= COST['要']; got = t; s.want = 0;
        out.push('你问他："你自己想要什么？"', '他愣了一下，像没听懂。"我？"', '他想了一会儿，笑了："我想看你笑。街口那' + t.slice(1) + '，你会喜欢的。"', '晚上' + t + '就在桌上了。');
      } else {
        got = '—';
        out.push('你问他："你自己想要什么？"', '他想了很久。', '"我想歇一会儿。"', '他靠着你，没多久就睡着了。');
      }
    } else if (k === '6' && !s.told && !s.seen) {
      you = '叫他别买了'; s.early = true; b = bigOne(s); got = b;
      out.push('你跟他说："别再给我买东西了。"', '他愣了一下，看看屋里他买的那些东西。"不喜欢吗？"',
        '你说不是。他点点头，没再问。', '第二天他抱回来' + b + '，额头上都是汗。"那些是我没挑好。这个你看看。"');
    } else if (k === '6' && s.seen && !s.told) {
      you = '叫他别买了'; s.told = true; s.want = 0;
      out.push('你跟他说："别再给我买东西了。"', '他愣了好一会儿。"你都知道了。"', '他坐着，手不知道往哪放。');
    } else return null;
    s.log.push({ i: i, you: you, got: got, face: face });
    s.i += 1;
    return out;
  }
  function windowEnd(s) {
    var out = ['他回家的路上，停在一个橱窗前。里面摆着一双蓝缎子的靴子，边上镶着天鹅绒。', '他看了好一会儿，笑了："我知道有个人会喜欢这双。"'];
    var g = s.g;
    if (s.told && g >= 20) { out.push('他站了一会儿，没进去。', '回家跟你说："今天看见一双靴子，你穿一定好看。"说完就去洗手了。'); s.end = '没进去'; }
    else if (!s.told && g >= 30) { s.g -= 14; out.push('他进去买了。回家放在你膝盖上。', '你问他贵不贵。他说："不贵。我们很有钱。"'); s.end = '买回来了'; }
    else { out.push('他进去了。', '铺子里的女人在后面听见一声叫，跑出来，看见他靠着柜台站着，一只手拿着那双蓝靴子，', '另一只手全是血，指甲缝里刮着金屑。', '那天晚上你在家等他。'); s.end = '血'; s.g = 0; }
    return out;
  }
  function ledger(s) {
    var rows = s.log.map(function (r) {
      return { when: '第 ' + (Math.floor(r.i / 4) + 1) + ' 年' + SEASON[r.i % 4], you: r.you, got: r.got || '没有', face: r.face };
    });
    var g = Math.max(0, s.g), last = '';
    if (s.end === '血') last = '';
    else if (g > 70) last = '他洗完手，坐到你旁边，把头靠在你肩上。过一会儿，你肩膀又有点麻了。';
    else if (g > 25) last = '他洗完手，坐到你旁边，把头靠在你肩上。不怎么沉了。';
    else last = '他洗完手，坐到你旁边，把头靠在你肩上。轻得你差点没觉出来。';
    return { rows: rows, last: last };
  }
  return { fresh: fresh, head: head, step: step, window: windowEnd, ledger: ledger };
})();
if (typeof module !== 'undefined') module.exports = TA;
