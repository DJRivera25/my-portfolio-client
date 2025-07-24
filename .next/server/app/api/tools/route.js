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
exports.id = "app/api/tools/route";
exports.ids = ["app/api/tools/route"];
exports.modules = {

/***/ "(rsc)/./app/api/tools/route.ts":
/*!********************************!*\
  !*** ./app/api/tools/route.ts ***!
  \********************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export */ __webpack_require__.d(__webpack_exports__, {\n/* harmony export */   DELETE: () => (/* binding */ DELETE),\n/* harmony export */   GET: () => (/* binding */ GET),\n/* harmony export */   POST: () => (/* binding */ POST),\n/* harmony export */   PUT: () => (/* binding */ PUT),\n/* harmony export */   runtime: () => (/* binding */ runtime)\n/* harmony export */ });\n/* harmony import */ var next_server__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! next/server */ \"(rsc)/./node_modules/next/dist/api/server.js\");\n/* harmony import */ var _lib_db__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @/lib/db */ \"(rsc)/./lib/db.ts\");\n/* harmony import */ var _lib_models_Tool__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! @/lib/models/Tool */ \"(rsc)/./lib/models/Tool.ts\");\n/* harmony import */ var _lib_cloudinary__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! @/lib/cloudinary */ \"(rsc)/./lib/cloudinary.ts\");\n\n\n\n\nconst runtime = \"nodejs\";\nasync function GET() {\n    await (0,_lib_db__WEBPACK_IMPORTED_MODULE_1__[\"default\"])();\n    const tools = await _lib_models_Tool__WEBPACK_IMPORTED_MODULE_2__[\"default\"].find();\n    return next_server__WEBPACK_IMPORTED_MODULE_0__.NextResponse.json(tools);\n}\nasync function POST(req) {\n    await (0,_lib_db__WEBPACK_IMPORTED_MODULE_1__[\"default\"])();\n    const contentType = req.headers.get(\"content-type\") || \"\";\n    if (!contentType.startsWith(\"multipart/form-data\")) {\n        return next_server__WEBPACK_IMPORTED_MODULE_0__.NextResponse.json({\n            message: \"Invalid content type\"\n        }, {\n            status: 400\n        });\n    }\n    const formData = await req.formData();\n    const name = formData.get(\"name\");\n    const category = formData.get(\"category\");\n    const file = formData.get(\"icon\");\n    if (!name || !category || !file || typeof file === \"string\") {\n        return next_server__WEBPACK_IMPORTED_MODULE_0__.NextResponse.json({\n            message: \"All fields including icon are required\"\n        }, {\n            status: 400\n        });\n    }\n    // Now file is a File\n    const arrayBuffer = await file.arrayBuffer();\n    const buffer = Buffer.from(arrayBuffer);\n    const upload = await new Promise((resolve, reject)=>{\n        _lib_cloudinary__WEBPACK_IMPORTED_MODULE_3__[\"default\"].uploader.upload_stream({\n            folder: \"tools\",\n            resource_type: \"image\",\n            allowed_formats: [\n                \"jpg\",\n                \"jpeg\",\n                \"png\",\n                \"webp\"\n            ]\n        }, (error, result)=>{\n            if (error) reject(error);\n            else resolve(result);\n        }).end(buffer);\n    });\n    const tool = await _lib_models_Tool__WEBPACK_IMPORTED_MODULE_2__[\"default\"].create({\n        name: String(name),\n        category: String(category),\n        icon: upload.secure_url\n    });\n    return next_server__WEBPACK_IMPORTED_MODULE_0__.NextResponse.json(tool, {\n        status: 201\n    });\n}\nasync function PUT(req) {\n    await (0,_lib_db__WEBPACK_IMPORTED_MODULE_1__[\"default\"])();\n    const contentType = req.headers.get(\"content-type\") || \"\";\n    if (!contentType.startsWith(\"multipart/form-data\")) {\n        return next_server__WEBPACK_IMPORTED_MODULE_0__.NextResponse.json({\n            message: \"Invalid content type\"\n        }, {\n            status: 400\n        });\n    }\n    const formData = await req.formData();\n    const id = formData.get(\"id\");\n    const name = formData.get(\"name\");\n    const category = formData.get(\"category\");\n    const file = formData.get(\"icon\");\n    if (!id) {\n        return next_server__WEBPACK_IMPORTED_MODULE_0__.NextResponse.json({\n            message: \"ID is required\"\n        }, {\n            status: 400\n        });\n    }\n    const tool = await _lib_models_Tool__WEBPACK_IMPORTED_MODULE_2__[\"default\"].findById(id);\n    if (!tool) {\n        return next_server__WEBPACK_IMPORTED_MODULE_0__.NextResponse.json({\n            message: \"Tool not found\"\n        }, {\n            status: 404\n        });\n    }\n    if (name) tool.name = String(name);\n    if (category) tool.category = String(category);\n    if (file && typeof file !== \"string\") {\n        const arrayBuffer = await file.arrayBuffer();\n        const buffer = Buffer.from(arrayBuffer);\n        const upload = await new Promise((resolve, reject)=>{\n            _lib_cloudinary__WEBPACK_IMPORTED_MODULE_3__[\"default\"].uploader.upload_stream({\n                folder: \"tools\",\n                resource_type: \"image\",\n                allowed_formats: [\n                    \"jpg\",\n                    \"jpeg\",\n                    \"png\",\n                    \"webp\"\n                ]\n            }, (error, result)=>{\n                if (error) reject(error);\n                else resolve(result);\n            }).end(buffer);\n        });\n        tool.icon = upload.secure_url;\n    }\n    const updated = await tool.save();\n    return next_server__WEBPACK_IMPORTED_MODULE_0__.NextResponse.json(updated);\n}\nasync function DELETE(req) {\n    await (0,_lib_db__WEBPACK_IMPORTED_MODULE_1__[\"default\"])();\n    const { id } = await req.json();\n    const deleted = await _lib_models_Tool__WEBPACK_IMPORTED_MODULE_2__[\"default\"].findByIdAndDelete(id);\n    if (!deleted) {\n        return next_server__WEBPACK_IMPORTED_MODULE_0__.NextResponse.json({\n            message: \"Tool not found\"\n        }, {\n            status: 404\n        });\n    }\n    return next_server__WEBPACK_IMPORTED_MODULE_0__.NextResponse.json({\n        message: \"Tool deleted successfully\"\n    });\n}\n//# sourceURL=[module]\n//# sourceMappingURL=data:application/json;charset=utf-8;base64,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TyxTQUFTO0lBQTRCO0FBQ2xFIiwic291cmNlcyI6WyJDOlxcVXNlcnNcXHN0ZXBoYW5pZVxcRG9jdW1lbnRzXFxCNTUwIE1DUCBNRVJOXFxXZWJQb3J0Zm9saW9cXG15LXBvcnRmb2xpby1jbGllbnRcXGFwcFxcYXBpXFx0b29sc1xccm91dGUudHMiXSwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHsgTmV4dFJlcXVlc3QsIE5leHRSZXNwb25zZSB9IGZyb20gXCJuZXh0L3NlcnZlclwiO1xyXG5pbXBvcnQgZGJDb25uZWN0IGZyb20gXCJAL2xpYi9kYlwiO1xyXG5pbXBvcnQgVG9vbCBmcm9tIFwiQC9saWIvbW9kZWxzL1Rvb2xcIjtcclxuaW1wb3J0IGNsb3VkaW5hcnkgZnJvbSBcIkAvbGliL2Nsb3VkaW5hcnlcIjtcclxuXHJcbmV4cG9ydCBjb25zdCBydW50aW1lID0gXCJub2RlanNcIjtcclxuXHJcbmV4cG9ydCBhc3luYyBmdW5jdGlvbiBHRVQoKSB7XHJcbiAgYXdhaXQgZGJDb25uZWN0KCk7XHJcbiAgY29uc3QgdG9vbHMgPSBhd2FpdCBUb29sLmZpbmQoKTtcclxuICByZXR1cm4gTmV4dFJlc3BvbnNlLmpzb24odG9vbHMpO1xyXG59XHJcblxyXG5leHBvcnQgYXN5bmMgZnVuY3Rpb24gUE9TVChyZXE6IE5leHRSZXF1ZXN0KSB7XHJcbiAgYXdhaXQgZGJDb25uZWN0KCk7XHJcbiAgY29uc3QgY29udGVudFR5cGUgPSByZXEuaGVhZGVycy5nZXQoXCJjb250ZW50LXR5cGVcIikgfHwgXCJcIjtcclxuICBpZiAoIWNvbnRlbnRUeXBlLnN0YXJ0c1dpdGgoXCJtdWx0aXBhcnQvZm9ybS1kYXRhXCIpKSB7XHJcbiAgICByZXR1cm4gTmV4dFJlc3BvbnNlLmpzb24oeyBtZXNzYWdlOiBcIkludmFsaWQgY29udGVudCB0eXBlXCIgfSwgeyBzdGF0dXM6IDQwMCB9KTtcclxuICB9XHJcbiAgY29uc3QgZm9ybURhdGEgPSBhd2FpdCByZXEuZm9ybURhdGEoKTtcclxuICBjb25zdCBuYW1lID0gZm9ybURhdGEuZ2V0KFwibmFtZVwiKTtcclxuICBjb25zdCBjYXRlZ29yeSA9IGZvcm1EYXRhLmdldChcImNhdGVnb3J5XCIpO1xyXG4gIGNvbnN0IGZpbGUgPSBmb3JtRGF0YS5nZXQoXCJpY29uXCIpO1xyXG4gIGlmICghbmFtZSB8fCAhY2F0ZWdvcnkgfHwgIWZpbGUgfHwgdHlwZW9mIGZpbGUgPT09IFwic3RyaW5nXCIpIHtcclxuICAgIHJldHVybiBOZXh0UmVzcG9uc2UuanNvbih7IG1lc3NhZ2U6IFwiQWxsIGZpZWxkcyBpbmNsdWRpbmcgaWNvbiBhcmUgcmVxdWlyZWRcIiB9LCB7IHN0YXR1czogNDAwIH0pO1xyXG4gIH1cclxuICAvLyBOb3cgZmlsZSBpcyBhIEZpbGVcclxuICBjb25zdCBhcnJheUJ1ZmZlciA9IGF3YWl0IGZpbGUuYXJyYXlCdWZmZXIoKTtcclxuICBjb25zdCBidWZmZXIgPSBCdWZmZXIuZnJvbShhcnJheUJ1ZmZlcik7XHJcbiAgY29uc3QgdXBsb2FkID0gYXdhaXQgbmV3IFByb21pc2U8YW55PigocmVzb2x2ZSwgcmVqZWN0KSA9PiB7XHJcbiAgICBjbG91ZGluYXJ5LnVwbG9hZGVyXHJcbiAgICAgIC51cGxvYWRfc3RyZWFtKFxyXG4gICAgICAgIHtcclxuICAgICAgICAgIGZvbGRlcjogXCJ0b29sc1wiLFxyXG4gICAgICAgICAgcmVzb3VyY2VfdHlwZTogXCJpbWFnZVwiLFxyXG4gICAgICAgICAgYWxsb3dlZF9mb3JtYXRzOiBbXCJqcGdcIiwgXCJqcGVnXCIsIFwicG5nXCIsIFwid2VicFwiXSxcclxuICAgICAgICB9LFxyXG4gICAgICAgIChlcnJvciwgcmVzdWx0KSA9PiB7XHJcbiAgICAgICAgICBpZiAoZXJyb3IpIHJlamVjdChlcnJvcik7XHJcbiAgICAgICAgICBlbHNlIHJlc29sdmUocmVzdWx0KTtcclxuICAgICAgICB9XHJcbiAgICAgIClcclxuICAgICAgLmVuZChidWZmZXIpO1xyXG4gIH0pO1xyXG4gIGNvbnN0IHRvb2wgPSBhd2FpdCBUb29sLmNyZWF0ZSh7IG5hbWU6IFN0cmluZyhuYW1lKSwgY2F0ZWdvcnk6IFN0cmluZyhjYXRlZ29yeSksIGljb246IHVwbG9hZC5zZWN1cmVfdXJsIH0pO1xyXG4gIHJldHVybiBOZXh0UmVzcG9uc2UuanNvbih0b29sLCB7IHN0YXR1czogMjAxIH0pO1xyXG59XHJcblxyXG5leHBvcnQgYXN5bmMgZnVuY3Rpb24gUFVUKHJlcTogTmV4dFJlcXVlc3QpIHtcclxuICBhd2FpdCBkYkNvbm5lY3QoKTtcclxuICBjb25zdCBjb250ZW50VHlwZSA9IHJlcS5oZWFkZXJzLmdldChcImNvbnRlbnQtdHlwZVwiKSB8fCBcIlwiO1xyXG4gIGlmICghY29udGVudFR5cGUuc3RhcnRzV2l0aChcIm11bHRpcGFydC9mb3JtLWRhdGFcIikpIHtcclxuICAgIHJldHVybiBOZXh0UmVzcG9uc2UuanNvbih7IG1lc3NhZ2U6IFwiSW52YWxpZCBjb250ZW50IHR5cGVcIiB9LCB7IHN0YXR1czogNDAwIH0pO1xyXG4gIH1cclxuICBjb25zdCBmb3JtRGF0YSA9IGF3YWl0IHJlcS5mb3JtRGF0YSgpO1xyXG4gIGNvbnN0IGlkID0gZm9ybURhdGEuZ2V0KFwiaWRcIik7XHJcbiAgY29uc3QgbmFtZSA9IGZvcm1EYXRhLmdldChcIm5hbWVcIik7XHJcbiAgY29uc3QgY2F0ZWdvcnkgPSBmb3JtRGF0YS5nZXQoXCJjYXRlZ29yeVwiKTtcclxuICBjb25zdCBmaWxlID0gZm9ybURhdGEuZ2V0KFwiaWNvblwiKTtcclxuICBpZiAoIWlkKSB7XHJcbiAgICByZXR1cm4gTmV4dFJlc3BvbnNlLmpzb24oeyBtZXNzYWdlOiBcIklEIGlzIHJlcXVpcmVkXCIgfSwgeyBzdGF0dXM6IDQwMCB9KTtcclxuICB9XHJcbiAgY29uc3QgdG9vbCA9IGF3YWl0IFRvb2wuZmluZEJ5SWQoaWQpO1xyXG4gIGlmICghdG9vbCkge1xyXG4gICAgcmV0dXJuIE5leHRSZXNwb25zZS5qc29uKHsgbWVzc2FnZTogXCJUb29sIG5vdCBmb3VuZFwiIH0sIHsgc3RhdHVzOiA0MDQgfSk7XHJcbiAgfVxyXG4gIGlmIChuYW1lKSB0b29sLm5hbWUgPSBTdHJpbmcobmFtZSk7XHJcbiAgaWYgKGNhdGVnb3J5KSB0b29sLmNhdGVnb3J5ID0gU3RyaW5nKGNhdGVnb3J5KTtcclxuICBpZiAoZmlsZSAmJiB0eXBlb2YgZmlsZSAhPT0gXCJzdHJpbmdcIikge1xyXG4gICAgY29uc3QgYXJyYXlCdWZmZXIgPSBhd2FpdCBmaWxlLmFycmF5QnVmZmVyKCk7XHJcbiAgICBjb25zdCBidWZmZXIgPSBCdWZmZXIuZnJvbShhcnJheUJ1ZmZlcik7XHJcbiAgICBjb25zdCB1cGxvYWQgPSBhd2FpdCBuZXcgUHJvbWlzZTxhbnk+KChyZXNvbHZlLCByZWplY3QpID0+IHtcclxuICAgICAgY2xvdWRpbmFyeS51cGxvYWRlclxyXG4gICAgICAgIC51cGxvYWRfc3RyZWFtKFxyXG4gICAgICAgICAge1xyXG4gICAgICAgICAgICBmb2xkZXI6IFwidG9vbHNcIixcclxuICAgICAgICAgICAgcmVzb3VyY2VfdHlwZTogXCJpbWFnZVwiLFxyXG4gICAgICAgICAgICBhbGxvd2VkX2Zvcm1hdHM6IFtcImpwZ1wiLCBcImpwZWdcIiwgXCJwbmdcIiwgXCJ3ZWJwXCJdLFxyXG4gICAgICAgICAgfSxcclxuICAgICAgICAgIChlcnJvciwgcmVzdWx0KSA9PiB7XHJcbiAgICAgICAgICAgIGlmIChlcnJvcikgcmVqZWN0KGVycm9yKTtcclxuICAgICAgICAgICAgZWxzZSByZXNvbHZlKHJlc3VsdCk7XHJcbiAgICAgICAgICB9XHJcbiAgICAgICAgKVxyXG4gICAgICAgIC5lbmQoYnVmZmVyKTtcclxuICAgIH0pO1xyXG4gICAgdG9vbC5pY29uID0gdXBsb2FkLnNlY3VyZV91cmw7XHJcbiAgfVxyXG4gIGNvbnN0IHVwZGF0ZWQgPSBhd2FpdCB0b29sLnNhdmUoKTtcclxuICByZXR1cm4gTmV4dFJlc3BvbnNlLmpzb24odXBkYXRlZCk7XHJcbn1cclxuXHJcbmV4cG9ydCBhc3luYyBmdW5jdGlvbiBERUxFVEUocmVxOiBOZXh0UmVxdWVzdCkge1xyXG4gIGF3YWl0IGRiQ29ubmVjdCgpO1xyXG4gIGNvbnN0IHsgaWQgfSA9IGF3YWl0IHJlcS5qc29uKCk7XHJcbiAgY29uc3QgZGVsZXRlZCA9IGF3YWl0IFRvb2wuZmluZEJ5SWRBbmREZWxldGUoaWQpO1xyXG4gIGlmICghZGVsZXRlZCkge1xyXG4gICAgcmV0dXJuIE5leHRSZXNwb25zZS5qc29uKHsgbWVzc2FnZTogXCJUb29sIG5vdCBmb3VuZFwiIH0sIHsgc3RhdHVzOiA0MDQgfSk7XHJcbiAgfVxyXG4gIHJldHVybiBOZXh0UmVzcG9uc2UuanNvbih7IG1lc3NhZ2U6IFwiVG9vbCBkZWxldGVkIHN1Y2Nlc3NmdWxseVwiIH0pO1xyXG59XHJcbiJdLCJuYW1lcyI6WyJOZXh0UmVzcG9uc2UiLCJkYkNvbm5lY3QiLCJUb29sIiwiY2xvdWRpbmFyeSIsInJ1bnRpbWUiLCJHRVQiLCJ0b29scyIsImZpbmQiLCJqc29uIiwiUE9TVCIsInJlcSIsImNvbnRlbnRUeXBlIiwiaGVhZGVycyIsImdldCIsInN0YXJ0c1dpdGgiLCJtZXNzYWdlIiwic3RhdHVzIiwiZm9ybURhdGEiLCJuYW1lIiwiY2F0ZWdvcnkiLCJmaWxlIiwiYXJyYXlCdWZmZXIiLCJidWZmZXIiLCJCdWZmZXIiLCJmcm9tIiwidXBsb2FkIiwiUHJvbWlzZSIsInJlc29sdmUiLCJyZWplY3QiLCJ1cGxvYWRlciIsInVwbG9hZF9zdHJlYW0iLCJmb2xkZXIiLCJyZXNvdXJjZV90eXBlIiwiYWxsb3dlZF9mb3JtYXRzIiwiZXJyb3IiLCJyZXN1bHQiLCJlbmQiLCJ0b29sIiwiY3JlYXRlIiwiU3RyaW5nIiwiaWNvbiIsInNlY3VyZV91cmwiLCJQVVQiLCJpZCIsImZpbmRCeUlkIiwidXBkYXRlZCIsInNhdmUiLCJERUxFVEUiLCJkZWxldGVkIiwiZmluZEJ5SWRBbmREZWxldGUiXSwiaWdub3JlTGlzdCI6W10sInNvdXJjZVJvb3QiOiIifQ==\n//# sourceURL=webpack-internal:///(rsc)/./app/api/tools/route.ts\n");

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

/***/ "(rsc)/./lib/models/Tool.ts":
/*!****************************!*\
  !*** ./lib/models/Tool.ts ***!
  \****************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export */ __webpack_require__.d(__webpack_exports__, {\n/* harmony export */   \"default\": () => (__WEBPACK_DEFAULT_EXPORT__)\n/* harmony export */ });\n/* harmony import */ var mongoose__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! mongoose */ \"mongoose\");\n/* harmony import */ var mongoose__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(mongoose__WEBPACK_IMPORTED_MODULE_0__);\n\nconst ToolSchema = new mongoose__WEBPACK_IMPORTED_MODULE_0__.Schema({\n    name: {\n        type: String,\n        required: true\n    },\n    icon: {\n        type: String\n    },\n    description: {\n        type: String\n    },\n    category: {\n        type: String\n    }\n}, {\n    timestamps: true\n});\nconst Tool = mongoose__WEBPACK_IMPORTED_MODULE_0__.models.Tool || (0,mongoose__WEBPACK_IMPORTED_MODULE_0__.model)(\"Tool\", ToolSchema);\n/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (Tool);\n//# sourceURL=[module]\n//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiKHJzYykvLi9saWIvbW9kZWxzL1Rvb2wudHMiLCJtYXBwaW5ncyI6Ijs7Ozs7O0FBQTJEO0FBRTNELE1BQU1HLGFBQWEsSUFBSUgsNENBQU1BLENBQzNCO0lBQ0VJLE1BQU07UUFBRUMsTUFBTUM7UUFBUUMsVUFBVTtJQUFLO0lBQ3JDQyxNQUFNO1FBQUVILE1BQU1DO0lBQU87SUFDckJHLGFBQWE7UUFBRUosTUFBTUM7SUFBTztJQUM1QkksVUFBVTtRQUFFTCxNQUFNQztJQUFPO0FBQzNCLEdBQ0E7SUFBRUssWUFBWTtBQUFLO0FBR3JCLE1BQU1DLE9BQU9YLDRDQUFNQSxDQUFDVyxJQUFJLElBQUlWLCtDQUFLQSxDQUFDLFFBQVFDO0FBRTFDLGlFQUFlUyxJQUFJQSxFQUFDIiwic291cmNlcyI6WyJDOlxcVXNlcnNcXHN0ZXBoYW5pZVxcRG9jdW1lbnRzXFxCNTUwIE1DUCBNRVJOXFxXZWJQb3J0Zm9saW9cXG15LXBvcnRmb2xpby1jbGllbnRcXGxpYlxcbW9kZWxzXFxUb29sLnRzIl0sInNvdXJjZXNDb250ZW50IjpbImltcG9ydCBtb25nb29zZSwgeyBTY2hlbWEsIG1vZGVscywgbW9kZWwgfSBmcm9tIFwibW9uZ29vc2VcIjtcclxuXHJcbmNvbnN0IFRvb2xTY2hlbWEgPSBuZXcgU2NoZW1hKFxyXG4gIHtcclxuICAgIG5hbWU6IHsgdHlwZTogU3RyaW5nLCByZXF1aXJlZDogdHJ1ZSB9LFxyXG4gICAgaWNvbjogeyB0eXBlOiBTdHJpbmcgfSxcclxuICAgIGRlc2NyaXB0aW9uOiB7IHR5cGU6IFN0cmluZyB9LFxyXG4gICAgY2F0ZWdvcnk6IHsgdHlwZTogU3RyaW5nIH0sXHJcbiAgfSxcclxuICB7IHRpbWVzdGFtcHM6IHRydWUgfVxyXG4pO1xyXG5cclxuY29uc3QgVG9vbCA9IG1vZGVscy5Ub29sIHx8IG1vZGVsKFwiVG9vbFwiLCBUb29sU2NoZW1hKTtcclxuXHJcbmV4cG9ydCBkZWZhdWx0IFRvb2w7XHJcbiJdLCJuYW1lcyI6WyJTY2hlbWEiLCJtb2RlbHMiLCJtb2RlbCIsIlRvb2xTY2hlbWEiLCJuYW1lIiwidHlwZSIsIlN0cmluZyIsInJlcXVpcmVkIiwiaWNvbiIsImRlc2NyaXB0aW9uIiwiY2F0ZWdvcnkiLCJ0aW1lc3RhbXBzIiwiVG9vbCJdLCJpZ25vcmVMaXN0IjpbXSwic291cmNlUm9vdCI6IiJ9\n//# sourceURL=webpack-internal:///(rsc)/./lib/models/Tool.ts\n");

/***/ }),

/***/ "(rsc)/./node_modules/next/dist/build/webpack/loaders/next-app-loader/index.js?name=app%2Fapi%2Ftools%2Froute&page=%2Fapi%2Ftools%2Froute&appPaths=&pagePath=private-next-app-dir%2Fapi%2Ftools%2Froute.ts&appDir=C%3A%5CUsers%5Cstephanie%5CDocuments%5CB550%20MCP%20MERN%5CWebPortfolio%5Cmy-portfolio-client%5Capp&pageExtensions=tsx&pageExtensions=ts&pageExtensions=jsx&pageExtensions=js&rootDir=C%3A%5CUsers%5Cstephanie%5CDocuments%5CB550%20MCP%20MERN%5CWebPortfolio%5Cmy-portfolio-client&isDev=true&tsconfigPath=tsconfig.json&basePath=&assetPrefix=&nextConfigOutput=&preferredRegion=&middlewareConfig=e30%3D!":
/*!*******************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************!*\
  !*** ./node_modules/next/dist/build/webpack/loaders/next-app-loader/index.js?name=app%2Fapi%2Ftools%2Froute&page=%2Fapi%2Ftools%2Froute&appPaths=&pagePath=private-next-app-dir%2Fapi%2Ftools%2Froute.ts&appDir=C%3A%5CUsers%5Cstephanie%5CDocuments%5CB550%20MCP%20MERN%5CWebPortfolio%5Cmy-portfolio-client%5Capp&pageExtensions=tsx&pageExtensions=ts&pageExtensions=jsx&pageExtensions=js&rootDir=C%3A%5CUsers%5Cstephanie%5CDocuments%5CB550%20MCP%20MERN%5CWebPortfolio%5Cmy-portfolio-client&isDev=true&tsconfigPath=tsconfig.json&basePath=&assetPrefix=&nextConfigOutput=&preferredRegion=&middlewareConfig=e30%3D! ***!
  \*******************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export */ __webpack_require__.d(__webpack_exports__, {\n/* harmony export */   patchFetch: () => (/* binding */ patchFetch),\n/* harmony export */   routeModule: () => (/* binding */ routeModule),\n/* harmony export */   serverHooks: () => (/* binding */ serverHooks),\n/* harmony export */   workAsyncStorage: () => (/* binding */ workAsyncStorage),\n/* harmony export */   workUnitAsyncStorage: () => (/* binding */ workUnitAsyncStorage)\n/* harmony export */ });\n/* harmony import */ var next_dist_server_route_modules_app_route_module_compiled__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! next/dist/server/route-modules/app-route/module.compiled */ \"(rsc)/./node_modules/next/dist/server/route-modules/app-route/module.compiled.js\");\n/* harmony import */ var next_dist_server_route_modules_app_route_module_compiled__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(next_dist_server_route_modules_app_route_module_compiled__WEBPACK_IMPORTED_MODULE_0__);\n/* harmony import */ var next_dist_server_route_kind__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! next/dist/server/route-kind */ \"(rsc)/./node_modules/next/dist/server/route-kind.js\");\n/* harmony import */ var next_dist_server_lib_patch_fetch__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! next/dist/server/lib/patch-fetch */ \"(rsc)/./node_modules/next/dist/server/lib/patch-fetch.js\");\n/* harmony import */ var next_dist_server_lib_patch_fetch__WEBPACK_IMPORTED_MODULE_2___default = /*#__PURE__*/__webpack_require__.n(next_dist_server_lib_patch_fetch__WEBPACK_IMPORTED_MODULE_2__);\n/* harmony import */ var C_Users_stephanie_Documents_B550_MCP_MERN_WebPortfolio_my_portfolio_client_app_api_tools_route_ts__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./app/api/tools/route.ts */ \"(rsc)/./app/api/tools/route.ts\");\n\n\n\n\n// We inject the nextConfigOutput here so that we can use them in the route\n// module.\nconst nextConfigOutput = \"\"\nconst routeModule = new next_dist_server_route_modules_app_route_module_compiled__WEBPACK_IMPORTED_MODULE_0__.AppRouteRouteModule({\n    definition: {\n        kind: next_dist_server_route_kind__WEBPACK_IMPORTED_MODULE_1__.RouteKind.APP_ROUTE,\n        page: \"/api/tools/route\",\n        pathname: \"/api/tools\",\n        filename: \"route\",\n        bundlePath: \"app/api/tools/route\"\n    },\n    resolvedPagePath: \"C:\\\\Users\\\\stephanie\\\\Documents\\\\B550 MCP MERN\\\\WebPortfolio\\\\my-portfolio-client\\\\app\\\\api\\\\tools\\\\route.ts\",\n    nextConfigOutput,\n    userland: C_Users_stephanie_Documents_B550_MCP_MERN_WebPortfolio_my_portfolio_client_app_api_tools_route_ts__WEBPACK_IMPORTED_MODULE_3__\n});\n// Pull out the exports that we need to expose from the module. This should\n// be eliminated when we've moved the other routes to the new format. These\n// are used to hook into the route.\nconst { workAsyncStorage, workUnitAsyncStorage, serverHooks } = routeModule;\nfunction patchFetch() {\n    return (0,next_dist_server_lib_patch_fetch__WEBPACK_IMPORTED_MODULE_2__.patchFetch)({\n        workAsyncStorage,\n        workUnitAsyncStorage\n    });\n}\n\n\n//# sourceMappingURL=app-route.js.map//# sourceURL=[module]\n//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiKHJzYykvLi9ub2RlX21vZHVsZXMvbmV4dC9kaXN0L2J1aWxkL3dlYnBhY2svbG9hZGVycy9uZXh0LWFwcC1sb2FkZXIvaW5kZXguanM/bmFtZT1hcHAlMkZhcGklMkZ0b29scyUyRnJvdXRlJnBhZ2U9JTJGYXBpJTJGdG9vbHMlMkZyb3V0ZSZhcHBQYXRocz0mcGFnZVBhdGg9cHJpdmF0ZS1uZXh0LWFwcC1kaXIlMkZhcGklMkZ0b29scyUyRnJvdXRlLnRzJmFwcERpcj1DJTNBJTVDVXNlcnMlNUNzdGVwaGFuaWUlNUNEb2N1bWVudHMlNUNCNTUwJTIwTUNQJTIwTUVSTiU1Q1dlYlBvcnRmb2xpbyU1Q215LXBvcnRmb2xpby1jbGllbnQlNUNhcHAmcGFnZUV4dGVuc2lvbnM9dHN4JnBhZ2VFeHRlbnNpb25zPXRzJnBhZ2VFeHRlbnNpb25zPWpzeCZwYWdlRXh0ZW5zaW9ucz1qcyZyb290RGlyPUMlM0ElNUNVc2VycyU1Q3N0ZXBoYW5pZSU1Q0RvY3VtZW50cyU1Q0I1NTAlMjBNQ1AlMjBNRVJOJTVDV2ViUG9ydGZvbGlvJTVDbXktcG9ydGZvbGlvLWNsaWVudCZpc0Rldj10cnVlJnRzY29uZmlnUGF0aD10c2NvbmZpZy5qc29uJmJhc2VQYXRoPSZhc3NldFByZWZpeD0mbmV4dENvbmZpZ091dHB1dD0mcHJlZmVycmVkUmVnaW9uPSZtaWRkbGV3YXJlQ29uZmlnPWUzMCUzRCEiLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7Ozs7QUFBK0Y7QUFDdkM7QUFDcUI7QUFDNEQ7QUFDekk7QUFDQTtBQUNBO0FBQ0Esd0JBQXdCLHlHQUFtQjtBQUMzQztBQUNBLGNBQWMsa0VBQVM7QUFDdkI7QUFDQTtBQUNBO0FBQ0E7QUFDQSxLQUFLO0FBQ0w7QUFDQTtBQUNBLFlBQVk7QUFDWixDQUFDO0FBQ0Q7QUFDQTtBQUNBO0FBQ0EsUUFBUSxzREFBc0Q7QUFDOUQ7QUFDQSxXQUFXLDRFQUFXO0FBQ3RCO0FBQ0E7QUFDQSxLQUFLO0FBQ0w7QUFDMEY7O0FBRTFGIiwic291cmNlcyI6WyIiXSwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHsgQXBwUm91dGVSb3V0ZU1vZHVsZSB9IGZyb20gXCJuZXh0L2Rpc3Qvc2VydmVyL3JvdXRlLW1vZHVsZXMvYXBwLXJvdXRlL21vZHVsZS5jb21waWxlZFwiO1xuaW1wb3J0IHsgUm91dGVLaW5kIH0gZnJvbSBcIm5leHQvZGlzdC9zZXJ2ZXIvcm91dGUta2luZFwiO1xuaW1wb3J0IHsgcGF0Y2hGZXRjaCBhcyBfcGF0Y2hGZXRjaCB9IGZyb20gXCJuZXh0L2Rpc3Qvc2VydmVyL2xpYi9wYXRjaC1mZXRjaFwiO1xuaW1wb3J0ICogYXMgdXNlcmxhbmQgZnJvbSBcIkM6XFxcXFVzZXJzXFxcXHN0ZXBoYW5pZVxcXFxEb2N1bWVudHNcXFxcQjU1MCBNQ1AgTUVSTlxcXFxXZWJQb3J0Zm9saW9cXFxcbXktcG9ydGZvbGlvLWNsaWVudFxcXFxhcHBcXFxcYXBpXFxcXHRvb2xzXFxcXHJvdXRlLnRzXCI7XG4vLyBXZSBpbmplY3QgdGhlIG5leHRDb25maWdPdXRwdXQgaGVyZSBzbyB0aGF0IHdlIGNhbiB1c2UgdGhlbSBpbiB0aGUgcm91dGVcbi8vIG1vZHVsZS5cbmNvbnN0IG5leHRDb25maWdPdXRwdXQgPSBcIlwiXG5jb25zdCByb3V0ZU1vZHVsZSA9IG5ldyBBcHBSb3V0ZVJvdXRlTW9kdWxlKHtcbiAgICBkZWZpbml0aW9uOiB7XG4gICAgICAgIGtpbmQ6IFJvdXRlS2luZC5BUFBfUk9VVEUsXG4gICAgICAgIHBhZ2U6IFwiL2FwaS90b29scy9yb3V0ZVwiLFxuICAgICAgICBwYXRobmFtZTogXCIvYXBpL3Rvb2xzXCIsXG4gICAgICAgIGZpbGVuYW1lOiBcInJvdXRlXCIsXG4gICAgICAgIGJ1bmRsZVBhdGg6IFwiYXBwL2FwaS90b29scy9yb3V0ZVwiXG4gICAgfSxcbiAgICByZXNvbHZlZFBhZ2VQYXRoOiBcIkM6XFxcXFVzZXJzXFxcXHN0ZXBoYW5pZVxcXFxEb2N1bWVudHNcXFxcQjU1MCBNQ1AgTUVSTlxcXFxXZWJQb3J0Zm9saW9cXFxcbXktcG9ydGZvbGlvLWNsaWVudFxcXFxhcHBcXFxcYXBpXFxcXHRvb2xzXFxcXHJvdXRlLnRzXCIsXG4gICAgbmV4dENvbmZpZ091dHB1dCxcbiAgICB1c2VybGFuZFxufSk7XG4vLyBQdWxsIG91dCB0aGUgZXhwb3J0cyB0aGF0IHdlIG5lZWQgdG8gZXhwb3NlIGZyb20gdGhlIG1vZHVsZS4gVGhpcyBzaG91bGRcbi8vIGJlIGVsaW1pbmF0ZWQgd2hlbiB3ZSd2ZSBtb3ZlZCB0aGUgb3RoZXIgcm91dGVzIHRvIHRoZSBuZXcgZm9ybWF0LiBUaGVzZVxuLy8gYXJlIHVzZWQgdG8gaG9vayBpbnRvIHRoZSByb3V0ZS5cbmNvbnN0IHsgd29ya0FzeW5jU3RvcmFnZSwgd29ya1VuaXRBc3luY1N0b3JhZ2UsIHNlcnZlckhvb2tzIH0gPSByb3V0ZU1vZHVsZTtcbmZ1bmN0aW9uIHBhdGNoRmV0Y2goKSB7XG4gICAgcmV0dXJuIF9wYXRjaEZldGNoKHtcbiAgICAgICAgd29ya0FzeW5jU3RvcmFnZSxcbiAgICAgICAgd29ya1VuaXRBc3luY1N0b3JhZ2VcbiAgICB9KTtcbn1cbmV4cG9ydCB7IHJvdXRlTW9kdWxlLCB3b3JrQXN5bmNTdG9yYWdlLCB3b3JrVW5pdEFzeW5jU3RvcmFnZSwgc2VydmVySG9va3MsIHBhdGNoRmV0Y2gsICB9O1xuXG4vLyMgc291cmNlTWFwcGluZ1VSTD1hcHAtcm91dGUuanMubWFwIl0sIm5hbWVzIjpbXSwiaWdub3JlTGlzdCI6W10sInNvdXJjZVJvb3QiOiIifQ==\n//# sourceURL=webpack-internal:///(rsc)/./node_modules/next/dist/build/webpack/loaders/next-app-loader/index.js?name=app%2Fapi%2Ftools%2Froute&page=%2Fapi%2Ftools%2Froute&appPaths=&pagePath=private-next-app-dir%2Fapi%2Ftools%2Froute.ts&appDir=C%3A%5CUsers%5Cstephanie%5CDocuments%5CB550%20MCP%20MERN%5CWebPortfolio%5Cmy-portfolio-client%5Capp&pageExtensions=tsx&pageExtensions=ts&pageExtensions=jsx&pageExtensions=js&rootDir=C%3A%5CUsers%5Cstephanie%5CDocuments%5CB550%20MCP%20MERN%5CWebPortfolio%5Cmy-portfolio-client&isDev=true&tsconfigPath=tsconfig.json&basePath=&assetPrefix=&nextConfigOutput=&preferredRegion=&middlewareConfig=e30%3D!\n");

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
var __webpack_exports__ = __webpack_require__.X(0, ["vendor-chunks/next","vendor-chunks/lodash","vendor-chunks/cloudinary","vendor-chunks/q"], () => (__webpack_exec__("(rsc)/./node_modules/next/dist/build/webpack/loaders/next-app-loader/index.js?name=app%2Fapi%2Ftools%2Froute&page=%2Fapi%2Ftools%2Froute&appPaths=&pagePath=private-next-app-dir%2Fapi%2Ftools%2Froute.ts&appDir=C%3A%5CUsers%5Cstephanie%5CDocuments%5CB550%20MCP%20MERN%5CWebPortfolio%5Cmy-portfolio-client%5Capp&pageExtensions=tsx&pageExtensions=ts&pageExtensions=jsx&pageExtensions=js&rootDir=C%3A%5CUsers%5Cstephanie%5CDocuments%5CB550%20MCP%20MERN%5CWebPortfolio%5Cmy-portfolio-client&isDev=true&tsconfigPath=tsconfig.json&basePath=&assetPrefix=&nextConfigOutput=&preferredRegion=&middlewareConfig=e30%3D!")));
module.exports = __webpack_exports__;

})();