import vtpl from './index';
import datestr from './plugins/datestr';
import htmlspecialchars from './plugins/htmlspecialchars';

vtpl.register('datestr', datestr);
vtpl.register('htmlspecialchars', htmlspecialchars);

export default vtpl;
