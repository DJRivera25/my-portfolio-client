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
exports.id = "app/api/projects/route";
exports.ids = ["app/api/projects/route"];
exports.modules = {

/***/ "(rsc)/./app/api/projects/route.ts":
/*!***********************************!*\
  !*** ./app/api/projects/route.ts ***!
  \***********************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export */ __webpack_require__.d(__webpack_exports__, {\n/* harmony export */   DELETE: () => (/* binding */ DELETE),\n/* harmony export */   GET: () => (/* binding */ GET),\n/* harmony export */   POST: () => (/* binding */ POST),\n/* harmony export */   PUT: () => (/* binding */ PUT),\n/* harmony export */   runtime: () => (/* binding */ runtime)\n/* harmony export */ });\n/* harmony import */ var next_server__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! next/server */ \"(rsc)/./node_modules/next/dist/api/server.js\");\n/* harmony import */ var _lib_db__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @/lib/db */ \"(rsc)/./lib/db.ts\");\n/* harmony import */ var _lib_models_Project__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! @/lib/models/Project */ \"(rsc)/./lib/models/Project.ts\");\n/* harmony import */ var _lib_cloudinary__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! @/lib/cloudinary */ \"(rsc)/./lib/cloudinary.ts\");\n\n\n\n\nconst runtime = \"nodejs\";\nasync function GET() {\n    await (0,_lib_db__WEBPACK_IMPORTED_MODULE_1__[\"default\"])();\n    const projects = await _lib_models_Project__WEBPACK_IMPORTED_MODULE_2__[\"default\"].find();\n    return next_server__WEBPACK_IMPORTED_MODULE_0__.NextResponse.json(projects);\n}\nasync function POST(req) {\n    await (0,_lib_db__WEBPACK_IMPORTED_MODULE_1__[\"default\"])();\n    const contentType = req.headers.get(\"content-type\") || \"\";\n    if (!contentType.startsWith(\"multipart/form-data\")) {\n        return next_server__WEBPACK_IMPORTED_MODULE_0__.NextResponse.json({\n            message: \"Invalid content type\"\n        }, {\n            status: 400\n        });\n    }\n    const formData = await req.formData();\n    const file = formData.get(\"image\");\n    const title = formData.get(\"title\");\n    const description = formData.get(\"description\");\n    const link = formData.get(\"link\");\n    if (!file || !title || !description || !link) {\n        return next_server__WEBPACK_IMPORTED_MODULE_0__.NextResponse.json({\n            message: \"All fields including image are required\"\n        }, {\n            status: 400\n        });\n    }\n    // @ts-ignore\n    const arrayBuffer = await file.arrayBuffer();\n    const buffer = Buffer.from(arrayBuffer);\n    const upload = await new Promise((resolve, reject)=>{\n        _lib_cloudinary__WEBPACK_IMPORTED_MODULE_3__[\"default\"].uploader.upload_stream({\n            folder: \"portfolio\",\n            resource_type: \"image\",\n            transformation: [\n                {\n                    width: 800,\n                    crop: \"limit\"\n                }\n            ]\n        }, (error, result)=>{\n            if (error) reject(error);\n            else resolve(result);\n        }).end(buffer);\n    });\n    const project = await _lib_models_Project__WEBPACK_IMPORTED_MODULE_2__[\"default\"].create({\n        title: String(title),\n        description: String(description),\n        link: String(link),\n        image: upload.secure_url\n    });\n    return next_server__WEBPACK_IMPORTED_MODULE_0__.NextResponse.json(project, {\n        status: 201\n    });\n}\nasync function PUT(request) {\n    await (0,_lib_db__WEBPACK_IMPORTED_MODULE_1__[\"default\"])();\n    const { id, ...update } = await request.json();\n    const updated = await _lib_models_Project__WEBPACK_IMPORTED_MODULE_2__[\"default\"].findByIdAndUpdate(id, update, {\n        new: true\n    });\n    if (!updated) {\n        return next_server__WEBPACK_IMPORTED_MODULE_0__.NextResponse.json({\n            message: \"Project not found\"\n        }, {\n            status: 404\n        });\n    }\n    return next_server__WEBPACK_IMPORTED_MODULE_0__.NextResponse.json(updated);\n}\nasync function DELETE(request) {\n    await (0,_lib_db__WEBPACK_IMPORTED_MODULE_1__[\"default\"])();\n    const { id } = await request.json();\n    const deleted = await _lib_models_Project__WEBPACK_IMPORTED_MODULE_2__[\"default\"].findByIdAndDelete(id);\n    if (!deleted) {\n        return next_server__WEBPACK_IMPORTED_MODULE_0__.NextResponse.json({\n            message: \"Project not found\"\n        }, {\n            status: 404\n        });\n    }\n    return next_server__WEBPACK_IMPORTED_MODULE_0__.NextResponse.json({\n        message: \"Project deleted successfully\"\n    });\n}\n//# sourceURL=[module]\n//# sourceMappingURL=data:application/json;charset=utf-8;base64,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WUEsQ0FBQ1EsSUFBSSxDQUFDO1lBQUVPLFNBQVM7UUFBb0IsR0FBRztZQUFFQyxRQUFRO1FBQUk7SUFDM0U7SUFDQSxPQUFPaEIscURBQVlBLENBQUNRLElBQUksQ0FBQztRQUFFTyxTQUFTO0lBQStCO0FBQ3JFIiwic291cmNlcyI6WyJDOlxcVXNlcnNcXHN0ZXBoYW5pZVxcRG9jdW1lbnRzXFxCNTUwIE1DUCBNRVJOXFxXZWJQb3J0Zm9saW9cXG15LXBvcnRmb2xpby1jbGllbnRcXGFwcFxcYXBpXFxwcm9qZWN0c1xccm91dGUudHMiXSwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHsgTmV4dFJlc3BvbnNlIH0gZnJvbSBcIm5leHQvc2VydmVyXCI7XHJcbmltcG9ydCBkYkNvbm5lY3QgZnJvbSBcIkAvbGliL2RiXCI7XHJcbmltcG9ydCBQcm9qZWN0IGZyb20gXCJAL2xpYi9tb2RlbHMvUHJvamVjdFwiO1xyXG5pbXBvcnQgY2xvdWRpbmFyeSBmcm9tIFwiQC9saWIvY2xvdWRpbmFyeVwiO1xyXG5cclxuZXhwb3J0IGNvbnN0IHJ1bnRpbWUgPSBcIm5vZGVqc1wiO1xyXG5cclxuZXhwb3J0IGFzeW5jIGZ1bmN0aW9uIEdFVCgpIHtcclxuICBhd2FpdCBkYkNvbm5lY3QoKTtcclxuICBjb25zdCBwcm9qZWN0cyA9IGF3YWl0IFByb2plY3QuZmluZCgpO1xyXG4gIHJldHVybiBOZXh0UmVzcG9uc2UuanNvbihwcm9qZWN0cyk7XHJcbn1cclxuXHJcbmV4cG9ydCBhc3luYyBmdW5jdGlvbiBQT1NUKHJlcTogUmVxdWVzdCkge1xyXG4gIGF3YWl0IGRiQ29ubmVjdCgpO1xyXG4gIGNvbnN0IGNvbnRlbnRUeXBlID0gcmVxLmhlYWRlcnMuZ2V0KFwiY29udGVudC10eXBlXCIpIHx8IFwiXCI7XHJcbiAgaWYgKCFjb250ZW50VHlwZS5zdGFydHNXaXRoKFwibXVsdGlwYXJ0L2Zvcm0tZGF0YVwiKSkge1xyXG4gICAgcmV0dXJuIE5leHRSZXNwb25zZS5qc29uKHsgbWVzc2FnZTogXCJJbnZhbGlkIGNvbnRlbnQgdHlwZVwiIH0sIHsgc3RhdHVzOiA0MDAgfSk7XHJcbiAgfVxyXG4gIGNvbnN0IGZvcm1EYXRhID0gYXdhaXQgcmVxLmZvcm1EYXRhKCk7XHJcbiAgY29uc3QgZmlsZSA9IGZvcm1EYXRhLmdldChcImltYWdlXCIpO1xyXG4gIGNvbnN0IHRpdGxlID0gZm9ybURhdGEuZ2V0KFwidGl0bGVcIik7XHJcbiAgY29uc3QgZGVzY3JpcHRpb24gPSBmb3JtRGF0YS5nZXQoXCJkZXNjcmlwdGlvblwiKTtcclxuICBjb25zdCBsaW5rID0gZm9ybURhdGEuZ2V0KFwibGlua1wiKTtcclxuICBpZiAoIWZpbGUgfHwgIXRpdGxlIHx8ICFkZXNjcmlwdGlvbiB8fCAhbGluaykge1xyXG4gICAgcmV0dXJuIE5leHRSZXNwb25zZS5qc29uKHsgbWVzc2FnZTogXCJBbGwgZmllbGRzIGluY2x1ZGluZyBpbWFnZSBhcmUgcmVxdWlyZWRcIiB9LCB7IHN0YXR1czogNDAwIH0pO1xyXG4gIH1cclxuICAvLyBAdHMtaWdub3JlXHJcbiAgY29uc3QgYXJyYXlCdWZmZXIgPSBhd2FpdCBmaWxlLmFycmF5QnVmZmVyKCk7XHJcbiAgY29uc3QgYnVmZmVyID0gQnVmZmVyLmZyb20oYXJyYXlCdWZmZXIpO1xyXG4gIGNvbnN0IHVwbG9hZCA9IGF3YWl0IG5ldyBQcm9taXNlPGFueT4oKHJlc29sdmUsIHJlamVjdCkgPT4ge1xyXG4gICAgY2xvdWRpbmFyeS51cGxvYWRlclxyXG4gICAgICAudXBsb2FkX3N0cmVhbShcclxuICAgICAgICB7XHJcbiAgICAgICAgICBmb2xkZXI6IFwicG9ydGZvbGlvXCIsXHJcbiAgICAgICAgICByZXNvdXJjZV90eXBlOiBcImltYWdlXCIsXHJcbiAgICAgICAgICB0cmFuc2Zvcm1hdGlvbjogW3sgd2lkdGg6IDgwMCwgY3JvcDogXCJsaW1pdFwiIH1dLFxyXG4gICAgICAgIH0sXHJcbiAgICAgICAgKGVycm9yLCByZXN1bHQpID0+IHtcclxuICAgICAgICAgIGlmIChlcnJvcikgcmVqZWN0KGVycm9yKTtcclxuICAgICAgICAgIGVsc2UgcmVzb2x2ZShyZXN1bHQpO1xyXG4gICAgICAgIH1cclxuICAgICAgKVxyXG4gICAgICAuZW5kKGJ1ZmZlcik7XHJcbiAgfSk7XHJcbiAgY29uc3QgcHJvamVjdCA9IGF3YWl0IFByb2plY3QuY3JlYXRlKHtcclxuICAgIHRpdGxlOiBTdHJpbmcodGl0bGUpLFxyXG4gICAgZGVzY3JpcHRpb246IFN0cmluZyhkZXNjcmlwdGlvbiksXHJcbiAgICBsaW5rOiBTdHJpbmcobGluayksXHJcbiAgICBpbWFnZTogdXBsb2FkLnNlY3VyZV91cmwsXHJcbiAgfSk7XHJcbiAgcmV0dXJuIE5leHRSZXNwb25zZS5qc29uKHByb2plY3QsIHsgc3RhdHVzOiAyMDEgfSk7XHJcbn1cclxuXHJcbmV4cG9ydCBhc3luYyBmdW5jdGlvbiBQVVQocmVxdWVzdDogUmVxdWVzdCkge1xyXG4gIGF3YWl0IGRiQ29ubmVjdCgpO1xyXG4gIGNvbnN0IHsgaWQsIC4uLnVwZGF0ZSB9ID0gYXdhaXQgcmVxdWVzdC5qc29uKCk7XHJcbiAgY29uc3QgdXBkYXRlZCA9IGF3YWl0IFByb2plY3QuZmluZEJ5SWRBbmRVcGRhdGUoaWQsIHVwZGF0ZSwgeyBuZXc6IHRydWUgfSk7XHJcbiAgaWYgKCF1cGRhdGVkKSB7XHJcbiAgICByZXR1cm4gTmV4dFJlc3BvbnNlLmpzb24oeyBtZXNzYWdlOiBcIlByb2plY3Qgbm90IGZvdW5kXCIgfSwgeyBzdGF0dXM6IDQwNCB9KTtcclxuICB9XHJcbiAgcmV0dXJuIE5leHRSZXNwb25zZS5qc29uKHVwZGF0ZWQpO1xyXG59XHJcblxyXG5leHBvcnQgYXN5bmMgZnVuY3Rpb24gREVMRVRFKHJlcXVlc3Q6IFJlcXVlc3QpIHtcclxuICBhd2FpdCBkYkNvbm5lY3QoKTtcclxuICBjb25zdCB7IGlkIH0gPSBhd2FpdCByZXF1ZXN0Lmpzb24oKTtcclxuICBjb25zdCBkZWxldGVkID0gYXdhaXQgUHJvamVjdC5maW5kQnlJZEFuZERlbGV0ZShpZCk7XHJcbiAgaWYgKCFkZWxldGVkKSB7XHJcbiAgICByZXR1cm4gTmV4dFJlc3BvbnNlLmpzb24oeyBtZXNzYWdlOiBcIlByb2plY3Qgbm90IGZvdW5kXCIgfSwgeyBzdGF0dXM6IDQwNCB9KTtcclxuICB9XHJcbiAgcmV0dXJuIE5leHRSZXNwb25zZS5qc29uKHsgbWVzc2FnZTogXCJQcm9qZWN0IGRlbGV0ZWQgc3VjY2Vzc2Z1bGx5XCIgfSk7XHJcbn1cclxuIl0sIm5hbWVzIjpbIk5leHRSZXNwb25zZSIsImRiQ29ubmVjdCIsIlByb2plY3QiLCJjbG91ZGluYXJ5IiwicnVudGltZSIsIkdFVCIsInByb2plY3RzIiwiZmluZCIsImpzb24iLCJQT1NUIiwicmVxIiwiY29udGVudFR5cGUiLCJoZWFkZXJzIiwiZ2V0Iiwic3RhcnRzV2l0aCIsIm1lc3NhZ2UiLCJzdGF0dXMiLCJmb3JtRGF0YSIsImZpbGUiLCJ0aXRsZSIsImRlc2NyaXB0aW9uIiwibGluayIsImFycmF5QnVmZmVyIiwiYnVmZmVyIiwiQnVmZmVyIiwiZnJvbSIsInVwbG9hZCIsIlByb21pc2UiLCJyZXNvbHZlIiwicmVqZWN0IiwidXBsb2FkZXIiLCJ1cGxvYWRfc3RyZWFtIiwiZm9sZGVyIiwicmVzb3VyY2VfdHlwZSIsInRyYW5zZm9ybWF0aW9uIiwid2lkdGgiLCJjcm9wIiwiZXJyb3IiLCJyZXN1bHQiLCJlbmQiLCJwcm9qZWN0IiwiY3JlYXRlIiwiU3RyaW5nIiwiaW1hZ2UiLCJzZWN1cmVfdXJsIiwiUFVUIiwicmVxdWVzdCIsImlkIiwidXBkYXRlIiwidXBkYXRlZCIsImZpbmRCeUlkQW5kVXBkYXRlIiwibmV3IiwiREVMRVRFIiwiZGVsZXRlZCIsImZpbmRCeUlkQW5kRGVsZXRlIl0sImlnbm9yZUxpc3QiOltdLCJzb3VyY2VSb290IjoiIn0=\n//# sourceURL=webpack-internal:///(rsc)/./app/api/projects/route.ts\n");

/***/ }),

/***/ "(rsc)/./lib/cloudinary.ts":
/*!***************************!*\
  !*** ./lib/cloudinary.ts ***!
  \***************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export */ __webpack_require__.d(__webpack_exports__, {\n/* harmony export */   \"default\": () => (__WEBPACK_DEFAULT_EXPORT__)\n/* harmony export */ });\n/* harmony import */ var cloudinary__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! cloudinary */ \"(rsc)/./node_modules/cloudinary/cloudinary.js\");\n/* harmony import */ var cloudinary__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(cloudinary__WEBPACK_IMPORTED_MODULE_0__);\n\ncloudinary__WEBPACK_IMPORTED_MODULE_0__.v2.config({\n    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,\n    api_key: process.env.CLOUDINARY_API_KEY,\n    api_secret: process.env.CLOUDINARY_API_SECRET\n});\n/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (cloudinary__WEBPACK_IMPORTED_MODULE_0__.v2);\n//# sourceURL=[module]\n//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiKHJzYykvLi9saWIvY2xvdWRpbmFyeS50cyIsIm1hcHBpbmdzIjoiOzs7Ozs7QUFBOEM7QUFFOUNDLDBDQUFVQSxDQUFDQyxNQUFNLENBQUM7SUFDaEJDLFlBQVlDLFFBQVFDLEdBQUcsQ0FBQ0MscUJBQXFCO0lBQzdDQyxTQUFTSCxRQUFRQyxHQUFHLENBQUNHLGtCQUFrQjtJQUN2Q0MsWUFBWUwsUUFBUUMsR0FBRyxDQUFDSyxxQkFBcUI7QUFDL0M7QUFFQSxpRUFBZVQsMENBQVVBLEVBQUMiLCJzb3VyY2VzIjpbIkM6XFxVc2Vyc1xcc3RlcGhhbmllXFxEb2N1bWVudHNcXEI1NTAgTUNQIE1FUk5cXFdlYlBvcnRmb2xpb1xcbXktcG9ydGZvbGlvLWNsaWVudFxcbGliXFxjbG91ZGluYXJ5LnRzIl0sInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7IHYyIGFzIGNsb3VkaW5hcnkgfSBmcm9tIFwiY2xvdWRpbmFyeVwiO1xyXG5cclxuY2xvdWRpbmFyeS5jb25maWcoe1xyXG4gIGNsb3VkX25hbWU6IHByb2Nlc3MuZW52LkNMT1VESU5BUllfQ0xPVURfTkFNRSxcclxuICBhcGlfa2V5OiBwcm9jZXNzLmVudi5DTE9VRElOQVJZX0FQSV9LRVksXHJcbiAgYXBpX3NlY3JldDogcHJvY2Vzcy5lbnYuQ0xPVURJTkFSWV9BUElfU0VDUkVULFxyXG59KTtcclxuXHJcbmV4cG9ydCBkZWZhdWx0IGNsb3VkaW5hcnk7XHJcbiJdLCJuYW1lcyI6WyJ2MiIsImNsb3VkaW5hcnkiLCJjb25maWciLCJjbG91ZF9uYW1lIiwicHJvY2VzcyIsImVudiIsIkNMT1VESU5BUllfQ0xPVURfTkFNRSIsImFwaV9rZXkiLCJDTE9VRElOQVJZX0FQSV9LRVkiLCJhcGlfc2VjcmV0IiwiQ0xPVURJTkFSWV9BUElfU0VDUkVUIl0sImlnbm9yZUxpc3QiOltdLCJzb3VyY2VSb290IjoiIn0=\n//# sourceURL=webpack-internal:///(rsc)/./lib/cloudinary.ts\n");

/***/ }),

/***/ "(rsc)/./lib/db.ts":
/*!*******************!*\
  !*** ./lib/db.ts ***!
  \*******************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export */ __webpack_require__.d(__webpack_exports__, {\n/* harmony export */   \"default\": () => (__WEBPACK_DEFAULT_EXPORT__)\n/* harmony export */ });\n/* harmony import */ var mongoose__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! mongoose */ \"mongoose\");\n/* harmony import */ var mongoose__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(mongoose__WEBPACK_IMPORTED_MODULE_0__);\n// @ts-ignore: process and global are available in Next.js runtime\n\nconst MONGODB_URI = process.env.MONGODB_URI;\nif (!MONGODB_URI) {\n    throw new Error(\"Please define the MONGODB_URI environment variable inside .env.local\");\n}\nlet cached = global.mongoose;\nif (!cached) {\n    cached = global.mongoose = {\n        conn: null,\n        promise: null\n    };\n}\nasync function dbConnect() {\n    if (cached.conn) {\n        return cached.conn;\n    }\n    if (!cached.promise) {\n        cached.promise = mongoose__WEBPACK_IMPORTED_MODULE_0___default().connect(MONGODB_URI, {\n            bufferCommands: false\n        }).then((mongoose)=>{\n            return mongoose;\n        });\n    }\n    cached.conn = await cached.promise;\n    return cached.conn;\n}\n/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (dbConnect);\n//# sourceURL=[module]\n//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiKHJzYykvLi9saWIvZGIudHMiLCJtYXBwaW5ncyI6Ijs7Ozs7O0FBQUEsa0VBQWtFO0FBQ2xDO0FBRWhDLE1BQU1DLGNBQWNDLFFBQVFDLEdBQUcsQ0FBQ0YsV0FBVztBQUUzQyxJQUFJLENBQUNBLGFBQWE7SUFDaEIsTUFBTSxJQUFJRyxNQUFNO0FBQ2xCO0FBRUEsSUFBSUMsU0FBUyxPQUFnQkwsUUFBUTtBQUVyQyxJQUFJLENBQUNLLFFBQVE7SUFDWEEsU0FBUyxPQUFnQkwsUUFBUSxHQUFHO1FBQUVPLE1BQU07UUFBTUMsU0FBUztJQUFLO0FBQ2xFO0FBRUEsZUFBZUM7SUFDYixJQUFJSixPQUFPRSxJQUFJLEVBQUU7UUFDZixPQUFPRixPQUFPRSxJQUFJO0lBQ3BCO0lBQ0EsSUFBSSxDQUFDRixPQUFPRyxPQUFPLEVBQUU7UUFDbkJILE9BQU9HLE9BQU8sR0FBR1IsdURBQ1AsQ0FBQ0MsYUFBYTtZQUNwQlUsZ0JBQWdCO1FBQ2xCLEdBQ0NDLElBQUksQ0FBQyxDQUFDWjtZQUNMLE9BQU9BO1FBQ1Q7SUFDSjtJQUNBSyxPQUFPRSxJQUFJLEdBQUcsTUFBTUYsT0FBT0csT0FBTztJQUNsQyxPQUFPSCxPQUFPRSxJQUFJO0FBQ3BCO0FBRUEsaUVBQWVFLFNBQVNBLEVBQUMiLCJzb3VyY2VzIjpbIkM6XFxVc2Vyc1xcc3RlcGhhbmllXFxEb2N1bWVudHNcXEI1NTAgTUNQIE1FUk5cXFdlYlBvcnRmb2xpb1xcbXktcG9ydGZvbGlvLWNsaWVudFxcbGliXFxkYi50cyJdLCJzb3VyY2VzQ29udGVudCI6WyIvLyBAdHMtaWdub3JlOiBwcm9jZXNzIGFuZCBnbG9iYWwgYXJlIGF2YWlsYWJsZSBpbiBOZXh0LmpzIHJ1bnRpbWVcclxuaW1wb3J0IG1vbmdvb3NlIGZyb20gXCJtb25nb29zZVwiO1xyXG5cclxuY29uc3QgTU9OR09EQl9VUkkgPSBwcm9jZXNzLmVudi5NT05HT0RCX1VSSSBhcyBzdHJpbmc7XHJcblxyXG5pZiAoIU1PTkdPREJfVVJJKSB7XHJcbiAgdGhyb3cgbmV3IEVycm9yKFwiUGxlYXNlIGRlZmluZSB0aGUgTU9OR09EQl9VUkkgZW52aXJvbm1lbnQgdmFyaWFibGUgaW5zaWRlIC5lbnYubG9jYWxcIik7XHJcbn1cclxuXHJcbmxldCBjYWNoZWQgPSAoZ2xvYmFsIGFzIGFueSkubW9uZ29vc2U7XHJcblxyXG5pZiAoIWNhY2hlZCkge1xyXG4gIGNhY2hlZCA9IChnbG9iYWwgYXMgYW55KS5tb25nb29zZSA9IHsgY29ubjogbnVsbCwgcHJvbWlzZTogbnVsbCB9O1xyXG59XHJcblxyXG5hc3luYyBmdW5jdGlvbiBkYkNvbm5lY3QoKSB7XHJcbiAgaWYgKGNhY2hlZC5jb25uKSB7XHJcbiAgICByZXR1cm4gY2FjaGVkLmNvbm47XHJcbiAgfVxyXG4gIGlmICghY2FjaGVkLnByb21pc2UpIHtcclxuICAgIGNhY2hlZC5wcm9taXNlID0gbW9uZ29vc2VcclxuICAgICAgLmNvbm5lY3QoTU9OR09EQl9VUkksIHtcclxuICAgICAgICBidWZmZXJDb21tYW5kczogZmFsc2UsXHJcbiAgICAgIH0gYXMgYW55KVxyXG4gICAgICAudGhlbigobW9uZ29vc2UpID0+IHtcclxuICAgICAgICByZXR1cm4gbW9uZ29vc2U7XHJcbiAgICAgIH0pO1xyXG4gIH1cclxuICBjYWNoZWQuY29ubiA9IGF3YWl0IGNhY2hlZC5wcm9taXNlO1xyXG4gIHJldHVybiBjYWNoZWQuY29ubjtcclxufVxyXG5cclxuZXhwb3J0IGRlZmF1bHQgZGJDb25uZWN0O1xyXG4iXSwibmFtZXMiOlsibW9uZ29vc2UiLCJNT05HT0RCX1VSSSIsInByb2Nlc3MiLCJlbnYiLCJFcnJvciIsImNhY2hlZCIsImdsb2JhbCIsImNvbm4iLCJwcm9taXNlIiwiZGJDb25uZWN0IiwiY29ubmVjdCIsImJ1ZmZlckNvbW1hbmRzIiwidGhlbiJdLCJpZ25vcmVMaXN0IjpbXSwic291cmNlUm9vdCI6IiJ9\n//# sourceURL=webpack-internal:///(rsc)/./lib/db.ts\n");

/***/ }),

/***/ "(rsc)/./lib/models/Project.ts":
/*!*******************************!*\
  !*** ./lib/models/Project.ts ***!
  \*******************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export */ __webpack_require__.d(__webpack_exports__, {\n/* harmony export */   \"default\": () => (__WEBPACK_DEFAULT_EXPORT__)\n/* harmony export */ });\n/* harmony import */ var mongoose__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! mongoose */ \"mongoose\");\n/* harmony import */ var mongoose__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(mongoose__WEBPACK_IMPORTED_MODULE_0__);\n\nconst ProjectSchema = new mongoose__WEBPACK_IMPORTED_MODULE_0__.Schema({\n    title: {\n        type: String,\n        required: true\n    },\n    description: {\n        type: String,\n        required: true\n    },\n    image: {\n        type: String,\n        required: true\n    },\n    link: {\n        type: String,\n        required: true\n    },\n    featured: {\n        type: Boolean,\n        default: false\n    }\n}, {\n    timestamps: true\n});\nconst Project = mongoose__WEBPACK_IMPORTED_MODULE_0__.models.Project || (0,mongoose__WEBPACK_IMPORTED_MODULE_0__.model)(\"Project\", ProjectSchema);\n/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (Project);\n//# sourceURL=[module]\n//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiKHJzYykvLi9saWIvbW9kZWxzL1Byb2plY3QudHMiLCJtYXBwaW5ncyI6Ijs7Ozs7O0FBQTJEO0FBRTNELE1BQU1HLGdCQUFnQixJQUFJSCw0Q0FBTUEsQ0FDOUI7SUFDRUksT0FBTztRQUFFQyxNQUFNQztRQUFRQyxVQUFVO0lBQUs7SUFDdENDLGFBQWE7UUFBRUgsTUFBTUM7UUFBUUMsVUFBVTtJQUFLO0lBQzVDRSxPQUFPO1FBQUVKLE1BQU1DO1FBQVFDLFVBQVU7SUFBSztJQUN0Q0csTUFBTTtRQUFFTCxNQUFNQztRQUFRQyxVQUFVO0lBQUs7SUFDckNJLFVBQVU7UUFBRU4sTUFBTU87UUFBU0MsU0FBUztJQUFNO0FBQzVDLEdBQ0E7SUFBRUMsWUFBWTtBQUFLO0FBR3JCLE1BQU1DLFVBQVVkLDRDQUFNQSxDQUFDYyxPQUFPLElBQUliLCtDQUFLQSxDQUFDLFdBQVdDO0FBRW5ELGlFQUFlWSxPQUFPQSxFQUFDIiwic291cmNlcyI6WyJDOlxcVXNlcnNcXHN0ZXBoYW5pZVxcRG9jdW1lbnRzXFxCNTUwIE1DUCBNRVJOXFxXZWJQb3J0Zm9saW9cXG15LXBvcnRmb2xpby1jbGllbnRcXGxpYlxcbW9kZWxzXFxQcm9qZWN0LnRzIl0sInNvdXJjZXNDb250ZW50IjpbImltcG9ydCBtb25nb29zZSwgeyBTY2hlbWEsIG1vZGVscywgbW9kZWwgfSBmcm9tIFwibW9uZ29vc2VcIjtcclxuXHJcbmNvbnN0IFByb2plY3RTY2hlbWEgPSBuZXcgU2NoZW1hKFxyXG4gIHtcclxuICAgIHRpdGxlOiB7IHR5cGU6IFN0cmluZywgcmVxdWlyZWQ6IHRydWUgfSxcclxuICAgIGRlc2NyaXB0aW9uOiB7IHR5cGU6IFN0cmluZywgcmVxdWlyZWQ6IHRydWUgfSxcclxuICAgIGltYWdlOiB7IHR5cGU6IFN0cmluZywgcmVxdWlyZWQ6IHRydWUgfSxcclxuICAgIGxpbms6IHsgdHlwZTogU3RyaW5nLCByZXF1aXJlZDogdHJ1ZSB9LFxyXG4gICAgZmVhdHVyZWQ6IHsgdHlwZTogQm9vbGVhbiwgZGVmYXVsdDogZmFsc2UgfSxcclxuICB9LFxyXG4gIHsgdGltZXN0YW1wczogdHJ1ZSB9XHJcbik7XHJcblxyXG5jb25zdCBQcm9qZWN0ID0gbW9kZWxzLlByb2plY3QgfHwgbW9kZWwoXCJQcm9qZWN0XCIsIFByb2plY3RTY2hlbWEpO1xyXG5cclxuZXhwb3J0IGRlZmF1bHQgUHJvamVjdDtcclxuIl0sIm5hbWVzIjpbIlNjaGVtYSIsIm1vZGVscyIsIm1vZGVsIiwiUHJvamVjdFNjaGVtYSIsInRpdGxlIiwidHlwZSIsIlN0cmluZyIsInJlcXVpcmVkIiwiZGVzY3JpcHRpb24iLCJpbWFnZSIsImxpbmsiLCJmZWF0dXJlZCIsIkJvb2xlYW4iLCJkZWZhdWx0IiwidGltZXN0YW1wcyIsIlByb2plY3QiXSwiaWdub3JlTGlzdCI6W10sInNvdXJjZVJvb3QiOiIifQ==\n//# sourceURL=webpack-internal:///(rsc)/./lib/models/Project.ts\n");

/***/ }),

/***/ "(rsc)/./node_modules/next/dist/build/webpack/loaders/next-app-loader/index.js?name=app%2Fapi%2Fprojects%2Froute&page=%2Fapi%2Fprojects%2Froute&appPaths=&pagePath=private-next-app-dir%2Fapi%2Fprojects%2Froute.ts&appDir=C%3A%5CUsers%5Cstephanie%5CDocuments%5CB550%20MCP%20MERN%5CWebPortfolio%5Cmy-portfolio-client%5Capp&pageExtensions=tsx&pageExtensions=ts&pageExtensions=jsx&pageExtensions=js&rootDir=C%3A%5CUsers%5Cstephanie%5CDocuments%5CB550%20MCP%20MERN%5CWebPortfolio%5Cmy-portfolio-client&isDev=true&tsconfigPath=tsconfig.json&basePath=&assetPrefix=&nextConfigOutput=&preferredRegion=&middlewareConfig=e30%3D!":
/*!****************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************!*\
  !*** ./node_modules/next/dist/build/webpack/loaders/next-app-loader/index.js?name=app%2Fapi%2Fprojects%2Froute&page=%2Fapi%2Fprojects%2Froute&appPaths=&pagePath=private-next-app-dir%2Fapi%2Fprojects%2Froute.ts&appDir=C%3A%5CUsers%5Cstephanie%5CDocuments%5CB550%20MCP%20MERN%5CWebPortfolio%5Cmy-portfolio-client%5Capp&pageExtensions=tsx&pageExtensions=ts&pageExtensions=jsx&pageExtensions=js&rootDir=C%3A%5CUsers%5Cstephanie%5CDocuments%5CB550%20MCP%20MERN%5CWebPortfolio%5Cmy-portfolio-client&isDev=true&tsconfigPath=tsconfig.json&basePath=&assetPrefix=&nextConfigOutput=&preferredRegion=&middlewareConfig=e30%3D! ***!
  \****************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export */ __webpack_require__.d(__webpack_exports__, {\n/* harmony export */   patchFetch: () => (/* binding */ patchFetch),\n/* harmony export */   routeModule: () => (/* binding */ routeModule),\n/* harmony export */   serverHooks: () => (/* binding */ serverHooks),\n/* harmony export */   workAsyncStorage: () => (/* binding */ workAsyncStorage),\n/* harmony export */   workUnitAsyncStorage: () => (/* binding */ workUnitAsyncStorage)\n/* harmony export */ });\n/* harmony import */ var next_dist_server_route_modules_app_route_module_compiled__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! next/dist/server/route-modules/app-route/module.compiled */ \"(rsc)/./node_modules/next/dist/server/route-modules/app-route/module.compiled.js\");\n/* harmony import */ var next_dist_server_route_modules_app_route_module_compiled__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(next_dist_server_route_modules_app_route_module_compiled__WEBPACK_IMPORTED_MODULE_0__);\n/* harmony import */ var next_dist_server_route_kind__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! next/dist/server/route-kind */ \"(rsc)/./node_modules/next/dist/server/route-kind.js\");\n/* harmony import */ var next_dist_server_lib_patch_fetch__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! next/dist/server/lib/patch-fetch */ \"(rsc)/./node_modules/next/dist/server/lib/patch-fetch.js\");\n/* harmony import */ var next_dist_server_lib_patch_fetch__WEBPACK_IMPORTED_MODULE_2___default = /*#__PURE__*/__webpack_require__.n(next_dist_server_lib_patch_fetch__WEBPACK_IMPORTED_MODULE_2__);\n/* harmony import */ var C_Users_stephanie_Documents_B550_MCP_MERN_WebPortfolio_my_portfolio_client_app_api_projects_route_ts__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./app/api/projects/route.ts */ \"(rsc)/./app/api/projects/route.ts\");\n\n\n\n\n// We inject the nextConfigOutput here so that we can use them in the route\n// module.\nconst nextConfigOutput = \"\"\nconst routeModule = new next_dist_server_route_modules_app_route_module_compiled__WEBPACK_IMPORTED_MODULE_0__.AppRouteRouteModule({\n    definition: {\n        kind: next_dist_server_route_kind__WEBPACK_IMPORTED_MODULE_1__.RouteKind.APP_ROUTE,\n        page: \"/api/projects/route\",\n        pathname: \"/api/projects\",\n        filename: \"route\",\n        bundlePath: \"app/api/projects/route\"\n    },\n    resolvedPagePath: \"C:\\\\Users\\\\stephanie\\\\Documents\\\\B550 MCP MERN\\\\WebPortfolio\\\\my-portfolio-client\\\\app\\\\api\\\\projects\\\\route.ts\",\n    nextConfigOutput,\n    userland: C_Users_stephanie_Documents_B550_MCP_MERN_WebPortfolio_my_portfolio_client_app_api_projects_route_ts__WEBPACK_IMPORTED_MODULE_3__\n});\n// Pull out the exports that we need to expose from the module. This should\n// be eliminated when we've moved the other routes to the new format. These\n// are used to hook into the route.\nconst { workAsyncStorage, workUnitAsyncStorage, serverHooks } = routeModule;\nfunction patchFetch() {\n    return (0,next_dist_server_lib_patch_fetch__WEBPACK_IMPORTED_MODULE_2__.patchFetch)({\n        workAsyncStorage,\n        workUnitAsyncStorage\n    });\n}\n\n\n//# sourceMappingURL=app-route.js.map//# sourceURL=[module]\n//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiKHJzYykvLi9ub2RlX21vZHVsZXMvbmV4dC9kaXN0L2J1aWxkL3dlYnBhY2svbG9hZGVycy9uZXh0LWFwcC1sb2FkZXIvaW5kZXguanM/bmFtZT1hcHAlMkZhcGklMkZwcm9qZWN0cyUyRnJvdXRlJnBhZ2U9JTJGYXBpJTJGcHJvamVjdHMlMkZyb3V0ZSZhcHBQYXRocz0mcGFnZVBhdGg9cHJpdmF0ZS1uZXh0LWFwcC1kaXIlMkZhcGklMkZwcm9qZWN0cyUyRnJvdXRlLnRzJmFwcERpcj1DJTNBJTVDVXNlcnMlNUNzdGVwaGFuaWUlNUNEb2N1bWVudHMlNUNCNTUwJTIwTUNQJTIwTUVSTiU1Q1dlYlBvcnRmb2xpbyU1Q215LXBvcnRmb2xpby1jbGllbnQlNUNhcHAmcGFnZUV4dGVuc2lvbnM9dHN4JnBhZ2VFeHRlbnNpb25zPXRzJnBhZ2VFeHRlbnNpb25zPWpzeCZwYWdlRXh0ZW5zaW9ucz1qcyZyb290RGlyPUMlM0ElNUNVc2VycyU1Q3N0ZXBoYW5pZSU1Q0RvY3VtZW50cyU1Q0I1NTAlMjBNQ1AlMjBNRVJOJTVDV2ViUG9ydGZvbGlvJTVDbXktcG9ydGZvbGlvLWNsaWVudCZpc0Rldj10cnVlJnRzY29uZmlnUGF0aD10c2NvbmZpZy5qc29uJmJhc2VQYXRoPSZhc3NldFByZWZpeD0mbmV4dENvbmZpZ091dHB1dD0mcHJlZmVycmVkUmVnaW9uPSZtaWRkbGV3YXJlQ29uZmlnPWUzMCUzRCEiLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7Ozs7QUFBK0Y7QUFDdkM7QUFDcUI7QUFDK0Q7QUFDNUk7QUFDQTtBQUNBO0FBQ0Esd0JBQXdCLHlHQUFtQjtBQUMzQztBQUNBLGNBQWMsa0VBQVM7QUFDdkI7QUFDQTtBQUNBO0FBQ0E7QUFDQSxLQUFLO0FBQ0w7QUFDQTtBQUNBLFlBQVk7QUFDWixDQUFDO0FBQ0Q7QUFDQTtBQUNBO0FBQ0EsUUFBUSxzREFBc0Q7QUFDOUQ7QUFDQSxXQUFXLDRFQUFXO0FBQ3RCO0FBQ0E7QUFDQSxLQUFLO0FBQ0w7QUFDMEY7O0FBRTFGIiwic291cmNlcyI6WyIiXSwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHsgQXBwUm91dGVSb3V0ZU1vZHVsZSB9IGZyb20gXCJuZXh0L2Rpc3Qvc2VydmVyL3JvdXRlLW1vZHVsZXMvYXBwLXJvdXRlL21vZHVsZS5jb21waWxlZFwiO1xuaW1wb3J0IHsgUm91dGVLaW5kIH0gZnJvbSBcIm5leHQvZGlzdC9zZXJ2ZXIvcm91dGUta2luZFwiO1xuaW1wb3J0IHsgcGF0Y2hGZXRjaCBhcyBfcGF0Y2hGZXRjaCB9IGZyb20gXCJuZXh0L2Rpc3Qvc2VydmVyL2xpYi9wYXRjaC1mZXRjaFwiO1xuaW1wb3J0ICogYXMgdXNlcmxhbmQgZnJvbSBcIkM6XFxcXFVzZXJzXFxcXHN0ZXBoYW5pZVxcXFxEb2N1bWVudHNcXFxcQjU1MCBNQ1AgTUVSTlxcXFxXZWJQb3J0Zm9saW9cXFxcbXktcG9ydGZvbGlvLWNsaWVudFxcXFxhcHBcXFxcYXBpXFxcXHByb2plY3RzXFxcXHJvdXRlLnRzXCI7XG4vLyBXZSBpbmplY3QgdGhlIG5leHRDb25maWdPdXRwdXQgaGVyZSBzbyB0aGF0IHdlIGNhbiB1c2UgdGhlbSBpbiB0aGUgcm91dGVcbi8vIG1vZHVsZS5cbmNvbnN0IG5leHRDb25maWdPdXRwdXQgPSBcIlwiXG5jb25zdCByb3V0ZU1vZHVsZSA9IG5ldyBBcHBSb3V0ZVJvdXRlTW9kdWxlKHtcbiAgICBkZWZpbml0aW9uOiB7XG4gICAgICAgIGtpbmQ6IFJvdXRlS2luZC5BUFBfUk9VVEUsXG4gICAgICAgIHBhZ2U6IFwiL2FwaS9wcm9qZWN0cy9yb3V0ZVwiLFxuICAgICAgICBwYXRobmFtZTogXCIvYXBpL3Byb2plY3RzXCIsXG4gICAgICAgIGZpbGVuYW1lOiBcInJvdXRlXCIsXG4gICAgICAgIGJ1bmRsZVBhdGg6IFwiYXBwL2FwaS9wcm9qZWN0cy9yb3V0ZVwiXG4gICAgfSxcbiAgICByZXNvbHZlZFBhZ2VQYXRoOiBcIkM6XFxcXFVzZXJzXFxcXHN0ZXBoYW5pZVxcXFxEb2N1bWVudHNcXFxcQjU1MCBNQ1AgTUVSTlxcXFxXZWJQb3J0Zm9saW9cXFxcbXktcG9ydGZvbGlvLWNsaWVudFxcXFxhcHBcXFxcYXBpXFxcXHByb2plY3RzXFxcXHJvdXRlLnRzXCIsXG4gICAgbmV4dENvbmZpZ091dHB1dCxcbiAgICB1c2VybGFuZFxufSk7XG4vLyBQdWxsIG91dCB0aGUgZXhwb3J0cyB0aGF0IHdlIG5lZWQgdG8gZXhwb3NlIGZyb20gdGhlIG1vZHVsZS4gVGhpcyBzaG91bGRcbi8vIGJlIGVsaW1pbmF0ZWQgd2hlbiB3ZSd2ZSBtb3ZlZCB0aGUgb3RoZXIgcm91dGVzIHRvIHRoZSBuZXcgZm9ybWF0LiBUaGVzZVxuLy8gYXJlIHVzZWQgdG8gaG9vayBpbnRvIHRoZSByb3V0ZS5cbmNvbnN0IHsgd29ya0FzeW5jU3RvcmFnZSwgd29ya1VuaXRBc3luY1N0b3JhZ2UsIHNlcnZlckhvb2tzIH0gPSByb3V0ZU1vZHVsZTtcbmZ1bmN0aW9uIHBhdGNoRmV0Y2goKSB7XG4gICAgcmV0dXJuIF9wYXRjaEZldGNoKHtcbiAgICAgICAgd29ya0FzeW5jU3RvcmFnZSxcbiAgICAgICAgd29ya1VuaXRBc3luY1N0b3JhZ2VcbiAgICB9KTtcbn1cbmV4cG9ydCB7IHJvdXRlTW9kdWxlLCB3b3JrQXN5bmNTdG9yYWdlLCB3b3JrVW5pdEFzeW5jU3RvcmFnZSwgc2VydmVySG9va3MsIHBhdGNoRmV0Y2gsICB9O1xuXG4vLyMgc291cmNlTWFwcGluZ1VSTD1hcHAtcm91dGUuanMubWFwIl0sIm5hbWVzIjpbXSwiaWdub3JlTGlzdCI6W10sInNvdXJjZVJvb3QiOiIifQ==\n//# sourceURL=webpack-internal:///(rsc)/./node_modules/next/dist/build/webpack/loaders/next-app-loader/index.js?name=app%2Fapi%2Fprojects%2Froute&page=%2Fapi%2Fprojects%2Froute&appPaths=&pagePath=private-next-app-dir%2Fapi%2Fprojects%2Froute.ts&appDir=C%3A%5CUsers%5Cstephanie%5CDocuments%5CB550%20MCP%20MERN%5CWebPortfolio%5Cmy-portfolio-client%5Capp&pageExtensions=tsx&pageExtensions=ts&pageExtensions=jsx&pageExtensions=js&rootDir=C%3A%5CUsers%5Cstephanie%5CDocuments%5CB550%20MCP%20MERN%5CWebPortfolio%5Cmy-portfolio-client&isDev=true&tsconfigPath=tsconfig.json&basePath=&assetPrefix=&nextConfigOutput=&preferredRegion=&middlewareConfig=e30%3D!\n");

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

/***/ "crypto":
/*!*************************!*\
  !*** external "crypto" ***!
  \*************************/
/***/ ((module) => {

"use strict";
module.exports = require("crypto");

/***/ }),

/***/ "fs":
/*!*********************!*\
  !*** external "fs" ***!
  \*********************/
/***/ ((module) => {

"use strict";
module.exports = require("fs");

/***/ }),

/***/ "http":
/*!***********************!*\
  !*** external "http" ***!
  \***********************/
/***/ ((module) => {

"use strict";
module.exports = require("http");

/***/ }),

/***/ "https":
/*!************************!*\
  !*** external "https" ***!
  \************************/
/***/ ((module) => {

"use strict";
module.exports = require("https");

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

/***/ }),

/***/ "path":
/*!***********************!*\
  !*** external "path" ***!
  \***********************/
/***/ ((module) => {

"use strict";
module.exports = require("path");

/***/ }),

/***/ "querystring":
/*!******************************!*\
  !*** external "querystring" ***!
  \******************************/
/***/ ((module) => {

"use strict";
module.exports = require("querystring");

/***/ }),

/***/ "stream":
/*!*************************!*\
  !*** external "stream" ***!
  \*************************/
/***/ ((module) => {

"use strict";
module.exports = require("stream");

/***/ }),

/***/ "url":
/*!**********************!*\
  !*** external "url" ***!
  \**********************/
/***/ ((module) => {

"use strict";
module.exports = require("url");

/***/ })

};
;

// load runtime
var __webpack_require__ = require("../../../webpack-runtime.js");
__webpack_require__.C(exports);
var __webpack_exec__ = (moduleId) => (__webpack_require__(__webpack_require__.s = moduleId))
var __webpack_exports__ = __webpack_require__.X(0, ["vendor-chunks/next","vendor-chunks/lodash","vendor-chunks/cloudinary","vendor-chunks/q"], () => (__webpack_exec__("(rsc)/./node_modules/next/dist/build/webpack/loaders/next-app-loader/index.js?name=app%2Fapi%2Fprojects%2Froute&page=%2Fapi%2Fprojects%2Froute&appPaths=&pagePath=private-next-app-dir%2Fapi%2Fprojects%2Froute.ts&appDir=C%3A%5CUsers%5Cstephanie%5CDocuments%5CB550%20MCP%20MERN%5CWebPortfolio%5Cmy-portfolio-client%5Capp&pageExtensions=tsx&pageExtensions=ts&pageExtensions=jsx&pageExtensions=js&rootDir=C%3A%5CUsers%5Cstephanie%5CDocuments%5CB550%20MCP%20MERN%5CWebPortfolio%5Cmy-portfolio-client&isDev=true&tsconfigPath=tsconfig.json&basePath=&assetPrefix=&nextConfigOutput=&preferredRegion=&middlewareConfig=e30%3D!")));
module.exports = __webpack_exports__;

})();