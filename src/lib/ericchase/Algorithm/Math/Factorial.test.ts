import { describe, expect, test } from 'bun:test';
import { ArrayShuffle } from '../Array.js';
import { Factorial } from './Factorial.js';

const tests: [string, () => void][] = [
  ['0', () => expect(Factorial(0)).toBe(1n)],
  ['1', () => expect(Factorial(1)).toBe(1n)],
  ['2', () => expect(Factorial(2)).toBe(2n)],
  ['3', () => expect(Factorial(3)).toBe(6n)],
  ['4', () => expect(Factorial(4)).toBe(24n)],
  ['5', () => expect(Factorial(5)).toBe(120n)],
  ['6', () => expect(Factorial(6)).toBe(720n)],
  ['7', () => expect(Factorial(7)).toBe(5040n)],
  ['8', () => expect(Factorial(8)).toBe(40320n)],
  ['9', () => expect(Factorial(9)).toBe(362880n)],
  ['10', () => expect(Factorial(10)).toBe(3628800n)],
  ['11', () => expect(Factorial(11)).toBe(39916800n)],
  ['12', () => expect(Factorial(12)).toBe(479001600n)],
  ['13', () => expect(Factorial(13)).toBe(6227020800n)],
  ['14', () => expect(Factorial(14)).toBe(87178291200n)],
  ['15', () => expect(Factorial(15)).toBe(1307674368000n)],
  ['16', () => expect(Factorial(16)).toBe(20922789888000n)],
  ['17', () => expect(Factorial(17)).toBe(355687428096000n)],
  ['18', () => expect(Factorial(18)).toBe(6402373705728000n)],
  ['19', () => expect(Factorial(19)).toBe(121645100408832000n)],
  ['20', () => expect(Factorial(20)).toBe(2432902008176640000n)],
  ['21', () => expect(Factorial(21)).toBe(51090942171709440000n)],
  ['22', () => expect(Factorial(22)).toBe(1124000727777607680000n)],
  ['23', () => expect(Factorial(23)).toBe(25852016738884976640000n)],
  ['24', () => expect(Factorial(24)).toBe(620448401733239439360000n)],
  ['25', () => expect(Factorial(25)).toBe(15511210043330985984000000n)],
  ['26', () => expect(Factorial(26)).toBe(403291461126605635584000000n)],
  ['27', () => expect(Factorial(27)).toBe(10888869450418352160768000000n)],
  ['28', () => expect(Factorial(28)).toBe(304888344611713860501504000000n)],
  ['29', () => expect(Factorial(29)).toBe(8841761993739701954543616000000n)],
  ['30', () => expect(Factorial(30)).toBe(265252859812191058636308480000000n)],
  ['31', () => expect(Factorial(31)).toBe(8222838654177922817725562880000000n)],
  ['32', () => expect(Factorial(32)).toBe(263130836933693530167218012160000000n)],
  ['33', () => expect(Factorial(33)).toBe(8683317618811886495518194401280000000n)],
  ['34', () => expect(Factorial(34)).toBe(295232799039604140847618609643520000000n)],
  ['35', () => expect(Factorial(35)).toBe(10333147966386144929666651337523200000000n)],
  ['36', () => expect(Factorial(36)).toBe(371993326789901217467999448150835200000000n)],
  ['37', () => expect(Factorial(37)).toBe(13763753091226345046315979581580902400000000n)],
  ['38', () => expect(Factorial(38)).toBe(523022617466601111760007224100074291200000000n)],
  ['39', () => expect(Factorial(39)).toBe(20397882081197443358640281739902897356800000000n)],
  ['40', () => expect(Factorial(40)).toBe(815915283247897734345611269596115894272000000000n)],
  ['41', () => expect(Factorial(41)).toBe(33452526613163807108170062053440751665152000000000n)],
  ['42', () => expect(Factorial(42)).toBe(1405006117752879898543142606244511569936384000000000n)],
  ['43', () => expect(Factorial(43)).toBe(60415263063373835637355132068513997507264512000000000n)],
  ['44', () => expect(Factorial(44)).toBe(2658271574788448768043625811014615890319638528000000000n)],
  ['45', () => expect(Factorial(45)).toBe(119622220865480194561963161495657715064383733760000000000n)],
  ['46', () => expect(Factorial(46)).toBe(5502622159812088949850305428800254892961651752960000000000n)],
  ['47', () => expect(Factorial(47)).toBe(258623241511168180642964355153611979969197632389120000000000n)],
  ['48', () => expect(Factorial(48)).toBe(12413915592536072670862289047373375038521486354677760000000000n)],
  ['49', () => expect(Factorial(49)).toBe(608281864034267560872252163321295376887552831379210240000000000n)],
  ['50', () => expect(Factorial(50)).toBe(30414093201713378043612608166064768844377641568960512000000000000n)],
  ['51', () => expect(Factorial(51)).toBe(1551118753287382280224243016469303211063259720016986112000000000000n)],
  ['52', () => expect(Factorial(52)).toBe(80658175170943878571660636856403766975289505440883277824000000000000n)],
  ['53', () => expect(Factorial(53)).toBe(4274883284060025564298013753389399649690343788366813724672000000000000n)],
  ['54', () => expect(Factorial(54)).toBe(230843697339241380472092742683027581083278564571807941132288000000000000n)],
  ['55', () => expect(Factorial(55)).toBe(12696403353658275925965100847566516959580321051449436762275840000000000000n)],
  ['56', () => expect(Factorial(56)).toBe(710998587804863451854045647463724949736497978881168458687447040000000000000n)],
  ['57', () => expect(Factorial(57)).toBe(40526919504877216755680601905432322134980384796226602145184481280000000000000n)],
  ['58', () => expect(Factorial(58)).toBe(2350561331282878571829474910515074683828862318181142924420699914240000000000000n)],
  ['59', () => expect(Factorial(59)).toBe(138683118545689835737939019720389406345902876772687432540821294940160000000000000n)],
  ['60', () => expect(Factorial(60)).toBe(8320987112741390144276341183223364380754172606361245952449277696409600000000000000n)],
  ['61', () => expect(Factorial(61)).toBe(507580213877224798800856812176625227226004528988036003099405939480985600000000000000n)],
  ['62', () => expect(Factorial(62)).toBe(31469973260387937525653122354950764088012280797258232192163168247821107200000000000000n)],
  ['63', () => expect(Factorial(63)).toBe(1982608315404440064116146708361898137544773690227268628106279599612729753600000000000000n)],
  ['64', () => expect(Factorial(64)).toBe(126886932185884164103433389335161480802865516174545192198801894375214704230400000000000000n)],
  ['65', () => expect(Factorial(65)).toBe(8247650592082470666723170306785496252186258551345437492922123134388955774976000000000000000n)],
  ['66', () => expect(Factorial(66)).toBe(544344939077443064003729240247842752644293064388798874532860126869671081148416000000000000000n)],
  ['67', () => expect(Factorial(67)).toBe(36471110918188685288249859096605464427167635314049524593701628500267962436943872000000000000000n)],
  ['68', () => expect(Factorial(68)).toBe(2480035542436830599600990418569171581047399201355367672371710738018221445712183296000000000000000n)],
  ['69', () => expect(Factorial(69)).toBe(171122452428141311372468338881272839092270544893520369393648040923257279754140647424000000000000000n)],
  ['70', () => expect(Factorial(70)).toBe(11978571669969891796072783721689098736458938142546425857555362864628009582789845319680000000000000000n)],
  ['71', () => expect(Factorial(71)).toBe(850478588567862317521167644239926010288584608120796235886430763388588680378079017697280000000000000000n)],
  ['72', () => expect(Factorial(72)).toBe(61234458376886086861524070385274672740778091784697328983823014963978384987221689274204160000000000000000n)],
  ['73', () => expect(Factorial(73)).toBe(4470115461512684340891257138125051110076800700282905015819080092370422104067183317016903680000000000000000n)],
  ['74', () => expect(Factorial(74)).toBe(330788544151938641225953028221253782145683251820934971170611926835411235700971565459250872320000000000000000n)],
  ['75', () => expect(Factorial(75)).toBe(24809140811395398091946477116594033660926243886570122837795894512655842677572867409443815424000000000000000000n)],
  ['76', () => expect(Factorial(76)).toBe(1885494701666050254987932260861146558230394535379329335672487982961844043495537923117729972224000000000000000000n)],
  ['77', () => expect(Factorial(77)).toBe(145183092028285869634070784086308284983740379224208358846781574688061991349156420080065207861248000000000000000000n)],
  ['78', () => expect(Factorial(78)).toBe(11324281178206297831457521158732046228731749579488251990048962825668835325234200766245086213177344000000000000000000n)],
  ['79', () => expect(Factorial(79)).toBe(894618213078297528685144171539831652069808216779571907213868063227837990693501860533361810841010176000000000000000000n)],
  ['80', () => expect(Factorial(80)).toBe(71569457046263802294811533723186532165584657342365752577109445058227039255480148842668944867280814080000000000000000000n)],
  ['81', () => expect(Factorial(81)).toBe(5797126020747367985879734231578109105412357244731625958745865049716390179693892056256184534249745940480000000000000000000n)],
  ['82', () => expect(Factorial(82)).toBe(475364333701284174842138206989404946643813294067993328617160934076743994734899148613007131808479167119360000000000000000000n)],
  ['83', () => expect(Factorial(83)).toBe(39455239697206586511897471180120610571436503407643446275224357528369751562996629334879591940103770870906880000000000000000000n)],
  ['84', () => expect(Factorial(84)).toBe(3314240134565353266999387579130131288000666286242049487118846032383059131291716864129885722968716753156177920000000000000000000n)],
  ['85', () => expect(Factorial(85)).toBe(281710411438055027694947944226061159480056634330574206405101912752560026159795933451040286452340924018275123200000000000000000000n)],
  ['86', () => expect(Factorial(86)).toBe(24227095383672732381765523203441259715284870552429381750838764496720162249742450276789464634901319465571660595200000000000000000000n)],
  ['87', () => expect(Factorial(87)).toBe(2107757298379527717213600518699389595229783738061356212322972511214654115727593174080683423236414793504734471782400000000000000000000n)],
  ['88', () => expect(Factorial(88)).toBe(185482642257398439114796845645546284380220968949399346684421580986889562184028199319100141244804501828416633516851200000000000000000000n)],
  ['89', () => expect(Factorial(89)).toBe(16507955160908461081216919262453619309839666236496541854913520707833171034378509739399912570787600662729080382999756800000000000000000000n)],
  ['90', () => expect(Factorial(90)).toBe(1485715964481761497309522733620825737885569961284688766942216863704985393094065876545992131370884059645617234469978112000000000000000000000n)],
  ['91', () => expect(Factorial(91)).toBe(135200152767840296255166568759495142147586866476906677791741734597153670771559994765685283954750449427751168336768008192000000000000000000000n)],
  ['92', () => expect(Factorial(92)).toBe(12438414054641307255475324325873553077577991715875414356840239582938137710983519518443046123837041347353107486982656753664000000000000000000000n)],
  ['93', () => expect(Factorial(93)).toBe(1156772507081641574759205162306240436214753229576413535186142281213246807121467315215203289516844845303838996289387078090752000000000000000000000n)],
  ['94', () => expect(Factorial(94)).toBe(108736615665674308027365285256786601004186803580182872307497374434045199869417927630229109214583415458560865651202385340530688000000000000000000000n)],
  ['95', () => expect(Factorial(95)).toBe(10329978488239059262599702099394727095397746340117372869212250571234293987594703124871765375385424468563282236864226607350415360000000000000000000000n)],
  ['96', () => expect(Factorial(96)).toBe(991677934870949689209571401541893801158183648651267795444376054838492222809091499987689476037000748982075094738965754305639874560000000000000000000000n)],
  ['97', () => expect(Factorial(97)).toBe(96192759682482119853328425949563698712343813919172976158104477319333745612481875498805879175589072651261284189679678167647067832320000000000000000000000n)],
  ['98', () => expect(Factorial(98)).toBe(9426890448883247745626185743057242473809693764078951663494238777294707070023223798882976159207729119823605850588608460429412647567360000000000000000000000n)],
  ['99', () => expect(Factorial(99)).toBe(933262154439441526816992388562667004907159682643816214685929638952175999932299156089414639761565182862536979208272237582511852109168640000000000000000000000n)],
  ['100', () => expect(Factorial(100)).toBe(93326215443944152681699238856266700490715968264381621468592963895217599993229915608941463976156518286253697920827223758251185210916864000000000000000000000000n)],
];

describe('Factorial', () => {
  for (const [n, fn] of ArrayShuffle(tests)) {
    test(n, fn);
  }
});
