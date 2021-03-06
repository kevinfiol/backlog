// import { HLTBService } from '../../container.js';
// import typecheck from '../../util/typecheck.js';

// export const search = async function(req, res) {
//     try {
//         let { name } = req.body;
//         typecheck({ string: name });

//         const results = await HLTBService.search(name);
//         typecheck({ array: results });
//         res.send(200, { results });
//     } catch(e) {
//         console.error(e);
//         res.send(500, { message: 'Error occured. Unable to search HowLongToBeat.' });
//     }
// };