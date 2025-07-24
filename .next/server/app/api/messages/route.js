/*
 * ATTENTION: An "eval-source-map" devtool has been used.
 * This devtool is neither made for production nor for readable output files.
 * It uses "eval()" calls to create a separate source file with attached SourceMaps in the browser devtools.
 * If you are trying to read the output file, select a different devtool (https://webpack.js.org/configuration/devtool/)
 * or disable the default devtool with "devtool: false".
 * If you are looking for production-ready output files, see mode: "production" (https://webpack.js.org/configuration/mode/).
 */
(() => {
var exports = {};
exports.id = "app/api/messages/route";
exports.ids = ["app/api/messages/route"];
exports.modules = {

/***/ "(rsc)/./app/api/messages/route.ts":
/*!***********************************!*\
  !*** ./app/api/messages/route.ts ***!
  \***********************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export */ __webpack_require__.d(__webpack_exports__, {\n/* harmony export */   DELETE: () => (/* binding */ DELETE),\n/* harmony export */   GET: () => (/* binding */ GET),\n/* harmony export */   POST: () => (/* binding */ POST),\n/* harmony export */   PUT: () => (/* binding */ PUT)\n/* harmony export */ });\n/* harmony import */ var next_server__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! next/server */ \"(rsc)/./node_modules/next/dist/api/server.js\");\n/* harmony import */ var _lib_db__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @/lib/db */ \"(rsc)/./lib/db.ts\");\n/* harmony import */ var _lib_models_Message__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! @/lib/models/Message */ \"(rsc)/./lib/models/Message.ts\");\n\n\n\nasync function GET() {\n    await (0,_lib_db__WEBPACK_IMPORTED_MODULE_1__[\"default\"])();\n    const messages = await _lib_models_Message__WEBPACK_IMPORTED_MODULE_2__[\"default\"].find();\n    return next_server__WEBPACK_IMPORTED_MODULE_0__.NextResponse.json(messages);\n}\nasync function POST(request) {\n    await (0,_lib_db__WEBPACK_IMPORTED_MODULE_1__[\"default\"])();\n    const data = await request.json();\n    // Map 'message' to 'content' for model compatibility\n    const { name, email, message, subject, ...rest } = data;\n    if (!name || !email || !message) {\n        return next_server__WEBPACK_IMPORTED_MODULE_0__.NextResponse.json({\n            message: \"Name, email, and message are required.\"\n        }, {\n            status: 400\n        });\n    }\n    const messageDoc = await _lib_models_Message__WEBPACK_IMPORTED_MODULE_2__[\"default\"].create({\n        name,\n        email,\n        content: message,\n        ...rest\n    });\n    return next_server__WEBPACK_IMPORTED_MODULE_0__.NextResponse.json(messageDoc, {\n        status: 201\n    });\n}\nasync function PUT(request) {\n    await (0,_lib_db__WEBPACK_IMPORTED_MODULE_1__[\"default\"])();\n    const { id, ...update } = await request.json();\n    const updated = await _lib_models_Message__WEBPACK_IMPORTED_MODULE_2__[\"default\"].findByIdAndUpdate(id, update, {\n        new: true\n    });\n    if (!updated) {\n        return next_server__WEBPACK_IMPORTED_MODULE_0__.NextResponse.json({\n            message: \"Message not found\"\n        }, {\n            status: 404\n        });\n    }\n    return next_server__WEBPACK_IMPORTED_MODULE_0__.NextResponse.json(updated);\n}\nasync function DELETE(request) {\n    await (0,_lib_db__WEBPACK_IMPORTED_MODULE_1__[\"default\"])();\n    const { id } = await request.json();\n    const deleted = await _lib_models_Message__WEBPACK_IMPORTED_MODULE_2__[\"default\"].findByIdAndDelete(id);\n    if (!deleted) {\n        return next_server__WEBPACK_IMPORTED_MODULE_0__.NextResponse.json({\n            message: \"Message not found\"\n        }, {\n            status: 404\n        });\n    }\n    return next_server__WEBPACK_IMPORTED_MODULE_0__.NextResponse.json({\n        message: \"Message deleted successfully\"\n    });\n}\n//# sourceURL=[module]\n//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiKHJzYykvLi9hcHAvYXBpL21lc3NhZ2VzL3JvdXRlLnRzIiwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7QUFBMkM7QUFDVjtBQUNVO0FBRXBDLGVBQWVHO0lBQ3BCLE1BQU1GLG1EQUFTQTtJQUNmLE1BQU1HLFdBQVcsTUFBTUYsMkRBQU9BLENBQUNHLElBQUk7SUFDbkMsT0FBT0wscURBQVlBLENBQUNNLElBQUksQ0FBQ0Y7QUFDM0I7QUFFTyxlQUFlRyxLQUFLQyxPQUFnQjtJQUN6QyxNQUFNUCxtREFBU0E7SUFDZixNQUFNUSxPQUFPLE1BQU1ELFFBQVFGLElBQUk7SUFDL0IscURBQXFEO0lBQ3JELE1BQU0sRUFBRUksSUFBSSxFQUFFQyxLQUFLLEVBQUVDLE9BQU8sRUFBRUMsT0FBTyxFQUFFLEdBQUdDLE1BQU0sR0FBR0w7SUFDbkQsSUFBSSxDQUFDQyxRQUFRLENBQUNDLFNBQVMsQ0FBQ0MsU0FBUztRQUMvQixPQUFPWixxREFBWUEsQ0FBQ00sSUFBSSxDQUFDO1lBQUVNLFNBQVM7UUFBeUMsR0FBRztZQUFFRyxRQUFRO1FBQUk7SUFDaEc7SUFDQSxNQUFNQyxhQUFhLE1BQU1kLDJEQUFPQSxDQUFDZSxNQUFNLENBQUM7UUFDdENQO1FBQ0FDO1FBQ0FPLFNBQVNOO1FBQ1QsR0FBR0UsSUFBSTtJQUNUO0lBQ0EsT0FBT2QscURBQVlBLENBQUNNLElBQUksQ0FBQ1UsWUFBWTtRQUFFRCxRQUFRO0lBQUk7QUFDckQ7QUFFTyxlQUFlSSxJQUFJWCxPQUFnQjtJQUN4QyxNQUFNUCxtREFBU0E7SUFDZixNQUFNLEVBQUVtQixFQUFFLEVBQUUsR0FBR0MsUUFBUSxHQUFHLE1BQU1iLFFBQVFGLElBQUk7SUFDNUMsTUFBTWdCLFVBQVUsTUFBTXBCLDJEQUFPQSxDQUFDcUIsaUJBQWlCLENBQUNILElBQUlDLFFBQVE7UUFBRUcsS0FBSztJQUFLO0lBQ3hFLElBQUksQ0FBQ0YsU0FBUztRQUNaLE9BQU90QixxREFBWUEsQ0FBQ00sSUFBSSxDQUFDO1lBQUVNLFNBQVM7UUFBb0IsR0FBRztZQUFFRyxRQUFRO1FBQUk7SUFDM0U7SUFDQSxPQUFPZixxREFBWUEsQ0FBQ00sSUFBSSxDQUFDZ0I7QUFDM0I7QUFFTyxlQUFlRyxPQUFPakIsT0FBZ0I7SUFDM0MsTUFBTVAsbURBQVNBO0lBQ2YsTUFBTSxFQUFFbUIsRUFBRSxFQUFFLEdBQUcsTUFBTVosUUFBUUYsSUFBSTtJQUNqQyxNQUFNb0IsVUFBVSxNQUFNeEIsMkRBQU9BLENBQUN5QixpQkFBaUIsQ0FBQ1A7SUFDaEQsSUFBSSxDQUFDTSxTQUFTO1FBQ1osT0FBTzFCLHFEQUFZQSxDQUFDTSxJQUFJLENBQUM7WUFBRU0sU0FBUztRQUFvQixHQUFHO1lBQUVHLFFBQVE7UUFBSTtJQUMzRTtJQUNBLE9BQU9mLHFEQUFZQSxDQUFDTSxJQUFJLENBQUM7UUFBRU0sU0FBUztJQUErQjtBQUNyRSIsInNvdXJjZXMiOlsiQzpcXFVzZXJzXFxzdGVwaGFuaWVcXERvY3VtZW50c1xcQjU1MCBNQ1AgTUVSTlxcV2ViUG9ydGZvbGlvXFxteS1wb3J0Zm9saW8tY2xpZW50XFxhcHBcXGFwaVxcbWVzc2FnZXNcXHJvdXRlLnRzIl0sInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7IE5leHRSZXNwb25zZSB9IGZyb20gXCJuZXh0L3NlcnZlclwiO1xyXG5pbXBvcnQgZGJDb25uZWN0IGZyb20gXCJAL2xpYi9kYlwiO1xyXG5pbXBvcnQgTWVzc2FnZSBmcm9tIFwiQC9saWIvbW9kZWxzL01lc3NhZ2VcIjtcclxuXHJcbmV4cG9ydCBhc3luYyBmdW5jdGlvbiBHRVQoKSB7XHJcbiAgYXdhaXQgZGJDb25uZWN0KCk7XHJcbiAgY29uc3QgbWVzc2FnZXMgPSBhd2FpdCBNZXNzYWdlLmZpbmQoKTtcclxuICByZXR1cm4gTmV4dFJlc3BvbnNlLmpzb24obWVzc2FnZXMpO1xyXG59XHJcblxyXG5leHBvcnQgYXN5bmMgZnVuY3Rpb24gUE9TVChyZXF1ZXN0OiBSZXF1ZXN0KSB7XHJcbiAgYXdhaXQgZGJDb25uZWN0KCk7XHJcbiAgY29uc3QgZGF0YSA9IGF3YWl0IHJlcXVlc3QuanNvbigpO1xyXG4gIC8vIE1hcCAnbWVzc2FnZScgdG8gJ2NvbnRlbnQnIGZvciBtb2RlbCBjb21wYXRpYmlsaXR5XHJcbiAgY29uc3QgeyBuYW1lLCBlbWFpbCwgbWVzc2FnZSwgc3ViamVjdCwgLi4ucmVzdCB9ID0gZGF0YTtcclxuICBpZiAoIW5hbWUgfHwgIWVtYWlsIHx8ICFtZXNzYWdlKSB7XHJcbiAgICByZXR1cm4gTmV4dFJlc3BvbnNlLmpzb24oeyBtZXNzYWdlOiBcIk5hbWUsIGVtYWlsLCBhbmQgbWVzc2FnZSBhcmUgcmVxdWlyZWQuXCIgfSwgeyBzdGF0dXM6IDQwMCB9KTtcclxuICB9XHJcbiAgY29uc3QgbWVzc2FnZURvYyA9IGF3YWl0IE1lc3NhZ2UuY3JlYXRlKHtcclxuICAgIG5hbWUsXHJcbiAgICBlbWFpbCxcclxuICAgIGNvbnRlbnQ6IG1lc3NhZ2UsIC8vIE1hcCB0byByZXF1aXJlZCBmaWVsZFxyXG4gICAgLi4ucmVzdCxcclxuICB9KTtcclxuICByZXR1cm4gTmV4dFJlc3BvbnNlLmpzb24obWVzc2FnZURvYywgeyBzdGF0dXM6IDIwMSB9KTtcclxufVxyXG5cclxuZXhwb3J0IGFzeW5jIGZ1bmN0aW9uIFBVVChyZXF1ZXN0OiBSZXF1ZXN0KSB7XHJcbiAgYXdhaXQgZGJDb25uZWN0KCk7XHJcbiAgY29uc3QgeyBpZCwgLi4udXBkYXRlIH0gPSBhd2FpdCByZXF1ZXN0Lmpzb24oKTtcclxuICBjb25zdCB1cGRhdGVkID0gYXdhaXQgTWVzc2FnZS5maW5kQnlJZEFuZFVwZGF0ZShpZCwgdXBkYXRlLCB7IG5ldzogdHJ1ZSB9KTtcclxuICBpZiAoIXVwZGF0ZWQpIHtcclxuICAgIHJldHVybiBOZXh0UmVzcG9uc2UuanNvbih7IG1lc3NhZ2U6IFwiTWVzc2FnZSBub3QgZm91bmRcIiB9LCB7IHN0YXR1czogNDA0IH0pO1xyXG4gIH1cclxuICByZXR1cm4gTmV4dFJlc3BvbnNlLmpzb24odXBkYXRlZCk7XHJcbn1cclxuXHJcbmV4cG9ydCBhc3luYyBmdW5jdGlvbiBERUxFVEUocmVxdWVzdDogUmVxdWVzdCkge1xyXG4gIGF3YWl0IGRiQ29ubmVjdCgpO1xyXG4gIGNvbnN0IHsgaWQgfSA9IGF3YWl0IHJlcXVlc3QuanNvbigpO1xyXG4gIGNvbnN0IGRlbGV0ZWQgPSBhd2FpdCBNZXNzYWdlLmZpbmRCeUlkQW5kRGVsZXRlKGlkKTtcclxuICBpZiAoIWRlbGV0ZWQpIHtcclxuICAgIHJldHVybiBOZXh0UmVzcG9uc2UuanNvbih7IG1lc3NhZ2U6IFwiTWVzc2FnZSBub3QgZm91bmRcIiB9LCB7IHN0YXR1czogNDA0IH0pO1xyXG4gIH1cclxuICByZXR1cm4gTmV4dFJlc3BvbnNlLmpzb24oeyBtZXNzYWdlOiBcIk1lc3NhZ2UgZGVsZXRlZCBzdWNjZXNzZnVsbHlcIiB9KTtcclxufVxyXG4iXSwibmFtZXMiOlsiTmV4dFJlc3BvbnNlIiwiZGJDb25uZWN0IiwiTWVzc2FnZSIsIkdFVCIsIm1lc3NhZ2VzIiwiZmluZCIsImpzb24iLCJQT1NUIiwicmVxdWVzdCIsImRhdGEiLCJuYW1lIiwiZW1haWwiLCJtZXNzYWdlIiwic3ViamVjdCIsInJlc3QiLCJzdGF0dXMiLCJtZXNzYWdlRG9jIiwiY3JlYXRlIiwiY29udGVudCIsIlBVVCIsImlkIiwidXBkYXRlIiwidXBkYXRlZCIsImZpbmRCeUlkQW5kVXBkYXRlIiwibmV3IiwiREVMRVRFIiwiZGVsZXRlZCIsImZpbmRCeUlkQW5kRGVsZXRlIl0sImlnbm9yZUxpc3QiOltdLCJzb3VyY2VSb290IjoiIn0=\n//# sourceURL=webpack-internal:///(rsc)/./app/api/messages/route.ts\n");

/***/ }),

/***/ "(rsc)/./lib/db.ts":
/*!*******************!*\
  !*** ./lib/db.ts ***!
  \*******************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export */ __webpack_require__.d(__webpack_exports__, {\n/* harmony export */   \"default\": () => (__WEBPACK_DEFAULT_EXPORT__)\n/* harmony export */ });\n/* harmony import */ var mongoose__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! mongoose */ \"mongoose\");\n/* harmony import */ var mongoose__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(mongoose__WEBPACK_IMPORTED_MODULE_0__);\n// @ts-ignore: process and global are available in Next.js runtime\n\nconst MONGODB_URI = process.env.MONGODB_URI;\nif (!MONGODB_URI) {\n    throw new Error(\"Please define the MONGODB_URI environment variable inside .env.local\");\n}\nlet cached = global.mongoose;\nif (!cached) {\n    cached = global.mongoose = {\n        conn: null,\n        promise: null\n    };\n}\nasync function dbConnect() {\n    if (cached.conn) {\n        return cached.conn;\n    }\n    if (!cached.promise) {\n        cached.promise = mongoose__WEBPACK_IMPORTED_MODULE_0___default().connect(MONGODB_URI, {\n            bufferCommands: false\n        }).then((mongoose)=>{\n            return mongoose;\n        });\n    }\n    cached.conn = await cached.promise;\n    return cached.conn;\n}\n/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (dbConnect);\n//# sourceURL=[module]\n//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiKHJzYykvLi9saWIvZGIudHMiLCJtYXBwaW5ncyI6Ijs7Ozs7O0FBQUEsa0VBQWtFO0FBQ2xDO0FBRWhDLE1BQU1DLGNBQWNDLFFBQVFDLEdBQUcsQ0FBQ0YsV0FBVztBQUUzQyxJQUFJLENBQUNBLGFBQWE7SUFDaEIsTUFBTSxJQUFJRyxNQUFNO0FBQ2xCO0FBRUEsSUFBSUMsU0FBUyxPQUFnQkwsUUFBUTtBQUVyQyxJQUFJLENBQUNLLFFBQVE7SUFDWEEsU0FBUyxPQUFnQkwsUUFBUSxHQUFHO1FBQUVPLE1BQU07UUFBTUMsU0FBUztJQUFLO0FBQ2xFO0FBRUEsZUFBZUM7SUFDYixJQUFJSixPQUFPRSxJQUFJLEVBQUU7UUFDZixPQUFPRixPQUFPRSxJQUFJO0lBQ3BCO0lBQ0EsSUFBSSxDQUFDRixPQUFPRyxPQUFPLEVBQUU7UUFDbkJILE9BQU9HLE9BQU8sR0FBR1IsdURBQ1AsQ0FBQ0MsYUFBYTtZQUNwQlUsZ0JBQWdCO1FBQ2xCLEdBQ0NDLElBQUksQ0FBQyxDQUFDWjtZQUNMLE9BQU9BO1FBQ1Q7SUFDSjtJQUNBSyxPQUFPRSxJQUFJLEdBQUcsTUFBTUYsT0FBT0csT0FBTztJQUNsQyxPQUFPSCxPQUFPRSxJQUFJO0FBQ3BCO0FBRUEsaUVBQWVFLFNBQVNBLEVBQUMiLCJzb3VyY2VzIjpbIkM6XFxVc2Vyc1xcc3RlcGhhbmllXFxEb2N1bWVudHNcXEI1NTAgTUNQIE1FUk5cXFdlYlBvcnRmb2xpb1xcbXktcG9ydGZvbGlvLWNsaWVudFxcbGliXFxkYi50cyJdLCJzb3VyY2VzQ29udGVudCI6WyIvLyBAdHMtaWdub3JlOiBwcm9jZXNzIGFuZCBnbG9iYWwgYXJlIGF2YWlsYWJsZSBpbiBOZXh0LmpzIHJ1bnRpbWVcclxuaW1wb3J0IG1vbmdvb3NlIGZyb20gXCJtb25nb29zZVwiO1xyXG5cclxuY29uc3QgTU9OR09EQl9VUkkgPSBwcm9jZXNzLmVudi5NT05HT0RCX1VSSSBhcyBzdHJpbmc7XHJcblxyXG5pZiAoIU1PTkdPREJfVVJJKSB7XHJcbiAgdGhyb3cgbmV3IEVycm9yKFwiUGxlYXNlIGRlZmluZSB0aGUgTU9OR09EQl9VUkkgZW52aXJvbm1lbnQgdmFyaWFibGUgaW5zaWRlIC5lbnYubG9jYWxcIik7XHJcbn1cclxuXHJcbmxldCBjYWNoZWQgPSAoZ2xvYmFsIGFzIGFueSkubW9uZ29vc2U7XHJcblxyXG5pZiAoIWNhY2hlZCkge1xyXG4gIGNhY2hlZCA9IChnbG9iYWwgYXMgYW55KS5tb25nb29zZSA9IHsgY29ubjogbnVsbCwgcHJvbWlzZTogbnVsbCB9O1xyXG59XHJcblxyXG5hc3luYyBmdW5jdGlvbiBkYkNvbm5lY3QoKSB7XHJcbiAgaWYgKGNhY2hlZC5jb25uKSB7XHJcbiAgICByZXR1cm4gY2FjaGVkLmNvbm47XHJcbiAgfVxyXG4gIGlmICghY2FjaGVkLnByb21pc2UpIHtcclxuICAgIGNhY2hlZC5wcm9taXNlID0gbW9uZ29vc2VcclxuICAgICAgLmNvbm5lY3QoTU9OR09EQl9VUkksIHtcclxuICAgICAgICBidWZmZXJDb21tYW5kczogZmFsc2UsXHJcbiAgICAgIH0gYXMgYW55KVxyXG4gICAgICAudGhlbigobW9uZ29vc2UpID0+IHtcclxuICAgICAgICByZXR1cm4gbW9uZ29vc2U7XHJcbiAgICAgIH0pO1xyXG4gIH1cclxuICBjYWNoZWQuY29ubiA9IGF3YWl0IGNhY2hlZC5wcm9taXNlO1xyXG4gIHJldHVybiBjYWNoZWQuY29ubjtcclxufVxyXG5cclxuZXhwb3J0IGRlZmF1bHQgZGJDb25uZWN0O1xyXG4iXSwibmFtZXMiOlsibW9uZ29vc2UiLCJNT05HT0RCX1VSSSIsInByb2Nlc3MiLCJlbnYiLCJFcnJvciIsImNhY2hlZCIsImdsb2JhbCIsImNvbm4iLCJwcm9taXNlIiwiZGJDb25uZWN0IiwiY29ubmVjdCIsImJ1ZmZlckNvbW1hbmRzIiwidGhlbiJdLCJpZ25vcmVMaXN0IjpbXSwic291cmNlUm9vdCI6IiJ9\n//# sourceURL=webpack-internal:///(rsc)/./lib/db.ts\n");

/***/ }),

/***/ "(rsc)/./lib/models/Message.ts":
/*!*******************************!*\
  !*** ./lib/models/Message.ts ***!
  \*******************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export */ __webpack_require__.d(__webpack_exports__, {\n/* harmony export */   \"default\": () => (__WEBPACK_DEFAULT_EXPORT__)\n/* harmony export */ });\n/* harmony import */ var mongoose__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! mongoose */ \"mongoose\");\n/* harmony import */ var mongoose__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(mongoose__WEBPACK_IMPORTED_MODULE_0__);\n\nconst MessageSchema = new mongoose__WEBPACK_IMPORTED_MODULE_0__.Schema({\n    name: {\n        type: String,\n        required: true\n    },\n    email: {\n        type: String,\n        required: true\n    },\n    content: {\n        type: String,\n        required: true\n    },\n    hasViewed: {\n        type: Boolean,\n        default: false\n    }\n}, {\n    timestamps: true\n});\nconst Message = mongoose__WEBPACK_IMPORTED_MODULE_0__.models.Message || (0,mongoose__WEBPACK_IMPORTED_MODULE_0__.model)(\"Message\", MessageSchema);\n/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (Message);\n//# sourceURL=[module]\n//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiKHJzYykvLi9saWIvbW9kZWxzL01lc3NhZ2UudHMiLCJtYXBwaW5ncyI6Ijs7Ozs7O0FBQTJEO0FBRTNELE1BQU1HLGdCQUFnQixJQUFJSCw0Q0FBTUEsQ0FDOUI7SUFDRUksTUFBTTtRQUFFQyxNQUFNQztRQUFRQyxVQUFVO0lBQUs7SUFDckNDLE9BQU87UUFBRUgsTUFBTUM7UUFBUUMsVUFBVTtJQUFLO0lBQ3RDRSxTQUFTO1FBQUVKLE1BQU1DO1FBQVFDLFVBQVU7SUFBSztJQUN4Q0csV0FBVztRQUFFTCxNQUFNTTtRQUFTQyxTQUFTO0lBQU07QUFDN0MsR0FDQTtJQUFFQyxZQUFZO0FBQUs7QUFHckIsTUFBTUMsVUFBVWIsNENBQU1BLENBQUNhLE9BQU8sSUFBSVosK0NBQUtBLENBQUMsV0FBV0M7QUFFbkQsaUVBQWVXLE9BQU9BLEVBQUMiLCJzb3VyY2VzIjpbIkM6XFxVc2Vyc1xcc3RlcGhhbmllXFxEb2N1bWVudHNcXEI1NTAgTUNQIE1FUk5cXFdlYlBvcnRmb2xpb1xcbXktcG9ydGZvbGlvLWNsaWVudFxcbGliXFxtb2RlbHNcXE1lc3NhZ2UudHMiXSwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IG1vbmdvb3NlLCB7IFNjaGVtYSwgbW9kZWxzLCBtb2RlbCB9IGZyb20gXCJtb25nb29zZVwiO1xyXG5cclxuY29uc3QgTWVzc2FnZVNjaGVtYSA9IG5ldyBTY2hlbWEoXHJcbiAge1xyXG4gICAgbmFtZTogeyB0eXBlOiBTdHJpbmcsIHJlcXVpcmVkOiB0cnVlIH0sXHJcbiAgICBlbWFpbDogeyB0eXBlOiBTdHJpbmcsIHJlcXVpcmVkOiB0cnVlIH0sXHJcbiAgICBjb250ZW50OiB7IHR5cGU6IFN0cmluZywgcmVxdWlyZWQ6IHRydWUgfSxcclxuICAgIGhhc1ZpZXdlZDogeyB0eXBlOiBCb29sZWFuLCBkZWZhdWx0OiBmYWxzZSB9LFxyXG4gIH0sXHJcbiAgeyB0aW1lc3RhbXBzOiB0cnVlIH1cclxuKTtcclxuXHJcbmNvbnN0IE1lc3NhZ2UgPSBtb2RlbHMuTWVzc2FnZSB8fCBtb2RlbChcIk1lc3NhZ2VcIiwgTWVzc2FnZVNjaGVtYSk7XHJcblxyXG5leHBvcnQgZGVmYXVsdCBNZXNzYWdlO1xyXG4iXSwibmFtZXMiOlsiU2NoZW1hIiwibW9kZWxzIiwibW9kZWwiLCJNZXNzYWdlU2NoZW1hIiwibmFtZSIsInR5cGUiLCJTdHJpbmciLCJyZXF1aXJlZCIsImVtYWlsIiwiY29udGVudCIsImhhc1ZpZXdlZCIsIkJvb2xlYW4iLCJkZWZhdWx0IiwidGltZXN0YW1wcyIsIk1lc3NhZ2UiXSwiaWdub3JlTGlzdCI6W10sInNvdXJjZVJvb3QiOiIifQ==\n//# sourceURL=webpack-internal:///(rsc)/./lib/models/Message.ts\n");

/***/ }),

/***/ "(rsc)/./node_modules/next/dist/build/webpack/loaders/next-app-loader/index.js?name=app%2Fapi%2Fmessages%2Froute&page=%2Fapi%2Fmessages%2Froute&appPaths=&pagePath=private-next-app-dir%2Fapi%2Fmessages%2Froute.ts&appDir=C%3A%5CUsers%5Cstephanie%5CDocuments%5CB550%20MCP%20MERN%5CWebPortfolio%5Cmy-portfolio-client%5Capp&pageExtensions=tsx&pageExtensions=ts&pageExtensions=jsx&pageExtensions=js&rootDir=C%3A%5CUsers%5Cstephanie%5CDocuments%5CB550%20MCP%20MERN%5CWebPortfolio%5Cmy-portfolio-client&isDev=true&tsconfigPath=tsconfig.json&basePath=&assetPrefix=&nextConfigOutput=&preferredRegion=&middlewareConfig=e30%3D!":
/*!****************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************!*\
  !*** ./node_modules/next/dist/build/webpack/loaders/next-app-loader/index.js?name=app%2Fapi%2Fmessages%2Froute&page=%2Fapi%2Fmessages%2Froute&appPaths=&pagePath=private-next-app-dir%2Fapi%2Fmessages%2Froute.ts&appDir=C%3A%5CUsers%5Cstephanie%5CDocuments%5CB550%20MCP%20MERN%5CWebPortfolio%5Cmy-portfolio-client%5Capp&pageExtensions=tsx&pageExtensions=ts&pageExtensions=jsx&pageExtensions=js&rootDir=C%3A%5CUsers%5Cstephanie%5CDocuments%5CB550%20MCP%20MERN%5CWebPortfolio%5Cmy-portfolio-client&isDev=true&tsconfigPath=tsconfig.json&basePath=&assetPrefix=&nextConfigOutput=&preferredRegion=&middlewareConfig=e30%3D! ***!
  \****************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export */ __webpack_require__.d(__webpack_exports__, {\n/* harmony export */   patchFetch: () => (/* binding */ patchFetch),\n/* harmony export */   routeModule: () => (/* binding */ routeModule),\n/* harmony export */   serverHooks: () => (/* binding */ serverHooks),\n/* harmony export */   workAsyncStorage: () => (/* binding */ workAsyncStorage),\n/* harmony export */   workUnitAsyncStorage: () => (/* binding */ workUnitAsyncStorage)\n/* harmony export */ });\n/* harmony import */ var next_dist_server_route_modules_app_route_module_compiled__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! next/dist/server/route-modules/app-route/module.compiled */ \"(rsc)/./node_modules/next/dist/server/route-modules/app-route/module.compiled.js\");\n/* harmony import */ var next_dist_server_route_modules_app_route_module_compiled__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(next_dist_server_route_modules_app_route_module_compiled__WEBPACK_IMPORTED_MODULE_0__);\n/* harmony import */ var next_dist_server_route_kind__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! next/dist/server/route-kind */ \"(rsc)/./node_modules/next/dist/server/route-kind.js\");\n/* harmony import */ var next_dist_server_lib_patch_fetch__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! next/dist/server/lib/patch-fetch */ \"(rsc)/./node_modules/next/dist/server/lib/patch-fetch.js\");\n/* harmony import */ var next_dist_server_lib_patch_fetch__WEBPACK_IMPORTED_MODULE_2___default = /*#__PURE__*/__webpack_require__.n(next_dist_server_lib_patch_fetch__WEBPACK_IMPORTED_MODULE_2__);\n/* harmony import */ var C_Users_stephanie_Documents_B550_MCP_MERN_WebPortfolio_my_portfolio_client_app_api_messages_route_ts__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./app/api/messages/route.ts */ \"(rsc)/./app/api/messages/route.ts\");\n\n\n\n\n// We inject the nextConfigOutput here so that we can use them in the route\n// module.\nconst nextConfigOutput = \"\"\nconst routeModule = new next_dist_server_route_modules_app_route_module_compiled__WEBPACK_IMPORTED_MODULE_0__.AppRouteRouteModule({\n    definition: {\n        kind: next_dist_server_route_kind__WEBPACK_IMPORTED_MODULE_1__.RouteKind.APP_ROUTE,\n        page: \"/api/messages/route\",\n        pathname: \"/api/messages\",\n        filename: \"route\",\n        bundlePath: \"app/api/messages/route\"\n    },\n    resolvedPagePath: \"C:\\\\Users\\\\stephanie\\\\Documents\\\\B550 MCP MERN\\\\WebPortfolio\\\\my-portfolio-client\\\\app\\\\api\\\\messages\\\\route.ts\",\n    nextConfigOutput,\n    userland: C_Users_stephanie_Documents_B550_MCP_MERN_WebPortfolio_my_portfolio_client_app_api_messages_route_ts__WEBPACK_IMPORTED_MODULE_3__\n});\n// Pull out the exports that we need to expose from the module. This should\n// be eliminated when we've moved the other routes to the new format. These\n// are used to hook into the route.\nconst { workAsyncStorage, workUnitAsyncStorage, serverHooks } = routeModule;\nfunction patchFetch() {\n    return (0,next_dist_server_lib_patch_fetch__WEBPACK_IMPORTED_MODULE_2__.patchFetch)({\n        workAsyncStorage,\n        workUnitAsyncStorage\n    });\n}\n\n\n//# sourceMappingURL=app-route.js.map//# sourceURL=[module]\n//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiKHJzYykvLi9ub2RlX21vZHVsZXMvbmV4dC9kaXN0L2J1aWxkL3dlYnBhY2svbG9hZGVycy9uZXh0LWFwcC1sb2FkZXIvaW5kZXguanM/bmFtZT1hcHAlMkZhcGklMkZtZXNzYWdlcyUyRnJvdXRlJnBhZ2U9JTJGYXBpJTJGbWVzc2FnZXMlMkZyb3V0ZSZhcHBQYXRocz0mcGFnZVBhdGg9cHJpdmF0ZS1uZXh0LWFwcC1kaXIlMkZhcGklMkZtZXNzYWdlcyUyRnJvdXRlLnRzJmFwcERpcj1DJTNBJTVDVXNlcnMlNUNzdGVwaGFuaWUlNUNEb2N1bWVudHMlNUNCNTUwJTIwTUNQJTIwTUVSTiU1Q1dlYlBvcnRmb2xpbyU1Q215LXBvcnRmb2xpby1jbGllbnQlNUNhcHAmcGFnZUV4dGVuc2lvbnM9dHN4JnBhZ2VFeHRlbnNpb25zPXRzJnBhZ2VFeHRlbnNpb25zPWpzeCZwYWdlRXh0ZW5zaW9ucz1qcyZyb290RGlyPUMlM0ElNUNVc2VycyU1Q3N0ZXBoYW5pZSU1Q0RvY3VtZW50cyU1Q0I1NTAlMjBNQ1AlMjBNRVJOJTVDV2ViUG9ydGZvbGlvJTVDbXktcG9ydGZvbGlvLWNsaWVudCZpc0Rldj10cnVlJnRzY29uZmlnUGF0aD10c2NvbmZpZy5qc29uJmJhc2VQYXRoPSZhc3NldFByZWZpeD0mbmV4dENvbmZpZ091dHB1dD0mcHJlZmVycmVkUmVnaW9uPSZtaWRkbGV3YXJlQ29uZmlnPWUzMCUzRCEiLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7Ozs7QUFBK0Y7QUFDdkM7QUFDcUI7QUFDK0Q7QUFDNUk7QUFDQTtBQUNBO0FBQ0Esd0JBQXdCLHlHQUFtQjtBQUMzQztBQUNBLGNBQWMsa0VBQVM7QUFDdkI7QUFDQTtBQUNBO0FBQ0E7QUFDQSxLQUFLO0FBQ0w7QUFDQTtBQUNBLFlBQVk7QUFDWixDQUFDO0FBQ0Q7QUFDQTtBQUNBO0FBQ0EsUUFBUSxzREFBc0Q7QUFDOUQ7QUFDQSxXQUFXLDRFQUFXO0FBQ3RCO0FBQ0E7QUFDQSxLQUFLO0FBQ0w7QUFDMEY7O0FBRTFGIiwic291cmNlcyI6WyIiXSwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHsgQXBwUm91dGVSb3V0ZU1vZHVsZSB9IGZyb20gXCJuZXh0L2Rpc3Qvc2VydmVyL3JvdXRlLW1vZHVsZXMvYXBwLXJvdXRlL21vZHVsZS5jb21waWxlZFwiO1xuaW1wb3J0IHsgUm91dGVLaW5kIH0gZnJvbSBcIm5leHQvZGlzdC9zZXJ2ZXIvcm91dGUta2luZFwiO1xuaW1wb3J0IHsgcGF0Y2hGZXRjaCBhcyBfcGF0Y2hGZXRjaCB9IGZyb20gXCJuZXh0L2Rpc3Qvc2VydmVyL2xpYi9wYXRjaC1mZXRjaFwiO1xuaW1wb3J0ICogYXMgdXNlcmxhbmQgZnJvbSBcIkM6XFxcXFVzZXJzXFxcXHN0ZXBoYW5pZVxcXFxEb2N1bWVudHNcXFxcQjU1MCBNQ1AgTUVSTlxcXFxXZWJQb3J0Zm9saW9cXFxcbXktcG9ydGZvbGlvLWNsaWVudFxcXFxhcHBcXFxcYXBpXFxcXG1lc3NhZ2VzXFxcXHJvdXRlLnRzXCI7XG4vLyBXZSBpbmplY3QgdGhlIG5leHRDb25maWdPdXRwdXQgaGVyZSBzbyB0aGF0IHdlIGNhbiB1c2UgdGhlbSBpbiB0aGUgcm91dGVcbi8vIG1vZHVsZS5cbmNvbnN0IG5leHRDb25maWdPdXRwdXQgPSBcIlwiXG5jb25zdCByb3V0ZU1vZHVsZSA9IG5ldyBBcHBSb3V0ZVJvdXRlTW9kdWxlKHtcbiAgICBkZWZpbml0aW9uOiB7XG4gICAgICAgIGtpbmQ6IFJvdXRlS2luZC5BUFBfUk9VVEUsXG4gICAgICAgIHBhZ2U6IFwiL2FwaS9tZXNzYWdlcy9yb3V0ZVwiLFxuICAgICAgICBwYXRobmFtZTogXCIvYXBpL21lc3NhZ2VzXCIsXG4gICAgICAgIGZpbGVuYW1lOiBcInJvdXRlXCIsXG4gICAgICAgIGJ1bmRsZVBhdGg6IFwiYXBwL2FwaS9tZXNzYWdlcy9yb3V0ZVwiXG4gICAgfSxcbiAgICByZXNvbHZlZFBhZ2VQYXRoOiBcIkM6XFxcXFVzZXJzXFxcXHN0ZXBoYW5pZVxcXFxEb2N1bWVudHNcXFxcQjU1MCBNQ1AgTUVSTlxcXFxXZWJQb3J0Zm9saW9cXFxcbXktcG9ydGZvbGlvLWNsaWVudFxcXFxhcHBcXFxcYXBpXFxcXG1lc3NhZ2VzXFxcXHJvdXRlLnRzXCIsXG4gICAgbmV4dENvbmZpZ091dHB1dCxcbiAgICB1c2VybGFuZFxufSk7XG4vLyBQdWxsIG91dCB0aGUgZXhwb3J0cyB0aGF0IHdlIG5lZWQgdG8gZXhwb3NlIGZyb20gdGhlIG1vZHVsZS4gVGhpcyBzaG91bGRcbi8vIGJlIGVsaW1pbmF0ZWQgd2hlbiB3ZSd2ZSBtb3ZlZCB0aGUgb3RoZXIgcm91dGVzIHRvIHRoZSBuZXcgZm9ybWF0LiBUaGVzZVxuLy8gYXJlIHVzZWQgdG8gaG9vayBpbnRvIHRoZSByb3V0ZS5cbmNvbnN0IHsgd29ya0FzeW5jU3RvcmFnZSwgd29ya1VuaXRBc3luY1N0b3JhZ2UsIHNlcnZlckhvb2tzIH0gPSByb3V0ZU1vZHVsZTtcbmZ1bmN0aW9uIHBhdGNoRmV0Y2goKSB7XG4gICAgcmV0dXJuIF9wYXRjaEZldGNoKHtcbiAgICAgICAgd29ya0FzeW5jU3RvcmFnZSxcbiAgICAgICAgd29ya1VuaXRBc3luY1N0b3JhZ2VcbiAgICB9KTtcbn1cbmV4cG9ydCB7IHJvdXRlTW9kdWxlLCB3b3JrQXN5bmNTdG9yYWdlLCB3b3JrVW5pdEFzeW5jU3RvcmFnZSwgc2VydmVySG9va3MsIHBhdGNoRmV0Y2gsICB9O1xuXG4vLyMgc291cmNlTWFwcGluZ1VSTD1hcHAtcm91dGUuanMubWFwIl0sIm5hbWVzIjpbXSwiaWdub3JlTGlzdCI6W10sInNvdXJjZVJvb3QiOiIifQ==\n//# sourceURL=webpack-internal:///(rsc)/./node_modules/next/dist/build/webpack/loaders/next-app-loader/index.js?name=app%2Fapi%2Fmessages%2Froute&page=%2Fapi%2Fmessages%2Froute&appPaths=&pagePath=private-next-app-dir%2Fapi%2Fmessages%2Froute.ts&appDir=C%3A%5CUsers%5Cstephanie%5CDocuments%5CB550%20MCP%20MERN%5CWebPortfolio%5Cmy-portfolio-client%5Capp&pageExtensions=tsx&pageExtensions=ts&pageExtensions=jsx&pageExtensions=js&rootDir=C%3A%5CUsers%5Cstephanie%5CDocuments%5CB550%20MCP%20MERN%5CWebPortfolio%5Cmy-portfolio-client&isDev=true&tsconfigPath=tsconfig.json&basePath=&assetPrefix=&nextConfigOutput=&preferredRegion=&middlewareConfig=e30%3D!\n");

/***/ }),

/***/ "(rsc)/./node_modules/next/dist/build/webpack/loaders/next-flight-client-entry-loader.js?server=true!":
/*!******************************************************************************************************!*\
  !*** ./node_modules/next/dist/build/webpack/loaders/next-flight-client-entry-loader.js?server=true! ***!
  \******************************************************************************************************/
/***/ (() => {



/***/ }),

/***/ "(ssr)/./node_modules/next/dist/build/webpack/loaders/next-flight-client-entry-loader.js?server=true!":
/*!******************************************************************************************************!*\
  !*** ./node_modules/next/dist/build/webpack/loaders/next-flight-client-entry-loader.js?server=true! ***!
  \******************************************************************************************************/
/***/ (() => {



/***/ }),

/***/ "../app-render/after-task-async-storage.external":
/*!***********************************************************************************!*\
  !*** external "next/dist/server/app-render/after-task-async-storage.external.js" ***!
  \***********************************************************************************/
/***/ ((module) => {

"use strict";
module.exports = require("next/dist/server/app-render/after-task-async-storage.external.js");

/***/ }),

/***/ "../app-render/work-async-storage.external":
/*!*****************************************************************************!*\
  !*** external "next/dist/server/app-render/work-async-storage.external.js" ***!
  \*****************************************************************************/
/***/ ((module) => {

"use strict";
module.exports = require("next/dist/server/app-render/work-async-storage.external.js");

/***/ }),

/***/ "./work-unit-async-storage.external":
/*!**********************************************************************************!*\
  !*** external "next/dist/server/app-render/work-unit-async-storage.external.js" ***!
  \**********************************************************************************/
/***/ ((module) => {

"use strict";
module.exports = require("next/dist/server/app-render/work-unit-async-storage.external.js");

/***/ }),

/***/ "mongoose":
/*!***************************!*\
  !*** external "mongoose" ***!
  \***************************/
/***/ ((module) => {

"use strict";
module.exports = require("mongoose");

/***/ }),

/***/ "next/dist/compiled/next-server/app-page.runtime.dev.js":
/*!*************************************************************************!*\
  !*** external "next/dist/compiled/next-server/app-page.runtime.dev.js" ***!
  \*************************************************************************/
/***/ ((module) => {

"use strict";
module.exports = require("next/dist/compiled/next-server/app-page.runtime.dev.js");

/***/ }),

/***/ "next/dist/compiled/next-server/app-route.runtime.dev.js":
/*!**************************************************************************!*\
  !*** external "next/dist/compiled/next-server/app-route.runtime.dev.js" ***!
  \**************************************************************************/
/***/ ((module) => {

"use strict";
module.exports = require("next/dist/compiled/next-server/app-route.runtime.dev.js");

/***/ })

};
;

// load runtime
var __webpack_require__ = require("../../../webpack-runtime.js");
__webpack_require__.C(exports);
var __webpack_exec__ = (moduleId) => (__webpack_require__(__webpack_require__.s = moduleId))
var __webpack_exports__ = __webpack_require__.X(0, ["vendor-chunks/next"], () => (__webpack_exec__("(rsc)/./node_modules/next/dist/build/webpack/loaders/next-app-loader/index.js?name=app%2Fapi%2Fmessages%2Froute&page=%2Fapi%2Fmessages%2Froute&appPaths=&pagePath=private-next-app-dir%2Fapi%2Fmessages%2Froute.ts&appDir=C%3A%5CUsers%5Cstephanie%5CDocuments%5CB550%20MCP%20MERN%5CWebPortfolio%5Cmy-portfolio-client%5Capp&pageExtensions=tsx&pageExtensions=ts&pageExtensions=jsx&pageExtensions=js&rootDir=C%3A%5CUsers%5Cstephanie%5CDocuments%5CB550%20MCP%20MERN%5CWebPortfolio%5Cmy-portfolio-client&isDev=true&tsconfigPath=tsconfig.json&basePath=&assetPrefix=&nextConfigOutput=&preferredRegion=&middlewareConfig=e30%3D!")));
module.exports = __webpack_exports__;

})();