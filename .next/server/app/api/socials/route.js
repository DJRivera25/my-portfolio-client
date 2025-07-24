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
exports.id = "app/api/socials/route";
exports.ids = ["app/api/socials/route"];
exports.modules = {

/***/ "(rsc)/./app/api/socials/route.ts":
/*!**********************************!*\
  !*** ./app/api/socials/route.ts ***!
  \**********************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export */ __webpack_require__.d(__webpack_exports__, {\n/* harmony export */   DELETE: () => (/* binding */ DELETE),\n/* harmony export */   GET: () => (/* binding */ GET),\n/* harmony export */   POST: () => (/* binding */ POST),\n/* harmony export */   PUT: () => (/* binding */ PUT),\n/* harmony export */   runtime: () => (/* binding */ runtime)\n/* harmony export */ });\n/* harmony import */ var next_server__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! next/server */ \"(rsc)/./node_modules/next/dist/api/server.js\");\n/* harmony import */ var _lib_db__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @/lib/db */ \"(rsc)/./lib/db.ts\");\n/* harmony import */ var _lib_models_Social__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! @/lib/models/Social */ \"(rsc)/./lib/models/Social.ts\");\n/* harmony import */ var _lib_cloudinary__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! @/lib/cloudinary */ \"(rsc)/./lib/cloudinary.ts\");\n\n\n\n\nconst runtime = \"nodejs\";\nasync function GET() {\n    await (0,_lib_db__WEBPACK_IMPORTED_MODULE_1__[\"default\"])();\n    const socials = await _lib_models_Social__WEBPACK_IMPORTED_MODULE_2__[\"default\"].find();\n    return next_server__WEBPACK_IMPORTED_MODULE_0__.NextResponse.json(socials);\n}\nasync function POST(req) {\n    await (0,_lib_db__WEBPACK_IMPORTED_MODULE_1__[\"default\"])();\n    const contentType = req.headers.get(\"content-type\") || \"\";\n    if (!contentType.startsWith(\"multipart/form-data\")) {\n        return next_server__WEBPACK_IMPORTED_MODULE_0__.NextResponse.json({\n            message: \"Invalid content type\"\n        }, {\n            status: 400\n        });\n    }\n    const formData = await req.formData();\n    const platform = formData.get(\"platform\");\n    const url = formData.get(\"url\");\n    const file = formData.get(\"icon\");\n    if (!platform || !url || !file || typeof file === \"string\") {\n        return next_server__WEBPACK_IMPORTED_MODULE_0__.NextResponse.json({\n            message: \"All fields including icon are required\"\n        }, {\n            status: 400\n        });\n    }\n    // Now file is a File\n    const arrayBuffer = await file.arrayBuffer();\n    const buffer = Buffer.from(arrayBuffer);\n    const upload = await new Promise((resolve, reject)=>{\n        _lib_cloudinary__WEBPACK_IMPORTED_MODULE_3__[\"default\"].uploader.upload_stream({\n            folder: \"socials\",\n            resource_type: \"image\",\n            allowed_formats: [\n                \"jpg\",\n                \"jpeg\",\n                \"png\",\n                \"webp\"\n            ]\n        }, (error, result)=>{\n            if (error) reject(error);\n            else resolve(result);\n        }).end(buffer);\n    });\n    const social = await _lib_models_Social__WEBPACK_IMPORTED_MODULE_2__[\"default\"].create({\n        platform: String(platform),\n        url: String(url),\n        icon: upload.secure_url\n    });\n    return next_server__WEBPACK_IMPORTED_MODULE_0__.NextResponse.json(social, {\n        status: 201\n    });\n}\nasync function PUT(req) {\n    await (0,_lib_db__WEBPACK_IMPORTED_MODULE_1__[\"default\"])();\n    const contentType = req.headers.get(\"content-type\") || \"\";\n    if (!contentType.startsWith(\"multipart/form-data\")) {\n        return next_server__WEBPACK_IMPORTED_MODULE_0__.NextResponse.json({\n            message: \"Invalid content type\"\n        }, {\n            status: 400\n        });\n    }\n    const formData = await req.formData();\n    const id = formData.get(\"id\");\n    const platform = formData.get(\"platform\");\n    const url = formData.get(\"url\");\n    const file = formData.get(\"icon\");\n    if (!id) {\n        return next_server__WEBPACK_IMPORTED_MODULE_0__.NextResponse.json({\n            message: \"ID is required\"\n        }, {\n            status: 400\n        });\n    }\n    const social = await _lib_models_Social__WEBPACK_IMPORTED_MODULE_2__[\"default\"].findById(id);\n    if (!social) {\n        return next_server__WEBPACK_IMPORTED_MODULE_0__.NextResponse.json({\n            message: \"Social not found\"\n        }, {\n            status: 404\n        });\n    }\n    if (platform) social.platform = String(platform);\n    if (url) social.url = String(url);\n    if (file && typeof file !== \"string\") {\n        const arrayBuffer = await file.arrayBuffer();\n        const buffer = Buffer.from(arrayBuffer);\n        const upload = await new Promise((resolve, reject)=>{\n            _lib_cloudinary__WEBPACK_IMPORTED_MODULE_3__[\"default\"].uploader.upload_stream({\n                folder: \"socials\",\n                resource_type: \"image\",\n                allowed_formats: [\n                    \"jpg\",\n                    \"jpeg\",\n                    \"png\",\n                    \"webp\"\n                ]\n            }, (error, result)=>{\n                if (error) reject(error);\n                else resolve(result);\n            }).end(buffer);\n        });\n        social.icon = upload.secure_url;\n    }\n    const updated = await social.save();\n    return next_server__WEBPACK_IMPORTED_MODULE_0__.NextResponse.json(updated);\n}\nasync function DELETE(req) {\n    await (0,_lib_db__WEBPACK_IMPORTED_MODULE_1__[\"default\"])();\n    const { id } = await req.json();\n    const deleted = await _lib_models_Social__WEBPACK_IMPORTED_MODULE_2__[\"default\"].findByIdAndDelete(id);\n    if (!deleted) {\n        return next_server__WEBPACK_IMPORTED_MODULE_0__.NextResponse.json({\n            message: \"Social not found\"\n        }, {\n            status: 404\n        });\n    }\n    return next_server__WEBPACK_IMPORTED_MODULE_0__.NextResponse.json({\n        message: \"Social deleted successfully\"\n    });\n}\n//# sourceURL=[module]\n//# sourceMappingURL=data:application/json;charset=utf-8;base64,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QUVPLFNBQVM7SUFBOEI7QUFDcEUiLCJzb3VyY2VzIjpbIkM6XFxVc2Vyc1xcc3RlcGhhbmllXFxEb2N1bWVudHNcXEI1NTAgTUNQIE1FUk5cXFdlYlBvcnRmb2xpb1xcbXktcG9ydGZvbGlvLWNsaWVudFxcYXBwXFxhcGlcXHNvY2lhbHNcXHJvdXRlLnRzIl0sInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7IE5leHRSZXF1ZXN0LCBOZXh0UmVzcG9uc2UgfSBmcm9tIFwibmV4dC9zZXJ2ZXJcIjtcclxuaW1wb3J0IGRiQ29ubmVjdCBmcm9tIFwiQC9saWIvZGJcIjtcclxuaW1wb3J0IFNvY2lhbCBmcm9tIFwiQC9saWIvbW9kZWxzL1NvY2lhbFwiO1xyXG5pbXBvcnQgY2xvdWRpbmFyeSBmcm9tIFwiQC9saWIvY2xvdWRpbmFyeVwiO1xyXG5cclxuZXhwb3J0IGNvbnN0IHJ1bnRpbWUgPSBcIm5vZGVqc1wiO1xyXG5cclxuZXhwb3J0IGFzeW5jIGZ1bmN0aW9uIEdFVCgpIHtcclxuICBhd2FpdCBkYkNvbm5lY3QoKTtcclxuICBjb25zdCBzb2NpYWxzID0gYXdhaXQgU29jaWFsLmZpbmQoKTtcclxuICByZXR1cm4gTmV4dFJlc3BvbnNlLmpzb24oc29jaWFscyk7XHJcbn1cclxuXHJcbmV4cG9ydCBhc3luYyBmdW5jdGlvbiBQT1NUKHJlcTogTmV4dFJlcXVlc3QpIHtcclxuICBhd2FpdCBkYkNvbm5lY3QoKTtcclxuICBjb25zdCBjb250ZW50VHlwZSA9IHJlcS5oZWFkZXJzLmdldChcImNvbnRlbnQtdHlwZVwiKSB8fCBcIlwiO1xyXG4gIGlmICghY29udGVudFR5cGUuc3RhcnRzV2l0aChcIm11bHRpcGFydC9mb3JtLWRhdGFcIikpIHtcclxuICAgIHJldHVybiBOZXh0UmVzcG9uc2UuanNvbih7IG1lc3NhZ2U6IFwiSW52YWxpZCBjb250ZW50IHR5cGVcIiB9LCB7IHN0YXR1czogNDAwIH0pO1xyXG4gIH1cclxuICBjb25zdCBmb3JtRGF0YSA9IGF3YWl0IHJlcS5mb3JtRGF0YSgpO1xyXG4gIGNvbnN0IHBsYXRmb3JtID0gZm9ybURhdGEuZ2V0KFwicGxhdGZvcm1cIik7XHJcbiAgY29uc3QgdXJsID0gZm9ybURhdGEuZ2V0KFwidXJsXCIpO1xyXG4gIGNvbnN0IGZpbGUgPSBmb3JtRGF0YS5nZXQoXCJpY29uXCIpO1xyXG4gIGlmICghcGxhdGZvcm0gfHwgIXVybCB8fCAhZmlsZSB8fCB0eXBlb2YgZmlsZSA9PT0gXCJzdHJpbmdcIikge1xyXG4gICAgcmV0dXJuIE5leHRSZXNwb25zZS5qc29uKHsgbWVzc2FnZTogXCJBbGwgZmllbGRzIGluY2x1ZGluZyBpY29uIGFyZSByZXF1aXJlZFwiIH0sIHsgc3RhdHVzOiA0MDAgfSk7XHJcbiAgfVxyXG4gIC8vIE5vdyBmaWxlIGlzIGEgRmlsZVxyXG4gIGNvbnN0IGFycmF5QnVmZmVyID0gYXdhaXQgZmlsZS5hcnJheUJ1ZmZlcigpO1xyXG4gIGNvbnN0IGJ1ZmZlciA9IEJ1ZmZlci5mcm9tKGFycmF5QnVmZmVyKTtcclxuICBjb25zdCB1cGxvYWQgPSBhd2FpdCBuZXcgUHJvbWlzZTxhbnk+KChyZXNvbHZlLCByZWplY3QpID0+IHtcclxuICAgIGNsb3VkaW5hcnkudXBsb2FkZXJcclxuICAgICAgLnVwbG9hZF9zdHJlYW0oXHJcbiAgICAgICAge1xyXG4gICAgICAgICAgZm9sZGVyOiBcInNvY2lhbHNcIixcclxuICAgICAgICAgIHJlc291cmNlX3R5cGU6IFwiaW1hZ2VcIixcclxuICAgICAgICAgIGFsbG93ZWRfZm9ybWF0czogW1wianBnXCIsIFwianBlZ1wiLCBcInBuZ1wiLCBcIndlYnBcIl0sXHJcbiAgICAgICAgfSxcclxuICAgICAgICAoZXJyb3IsIHJlc3VsdCkgPT4ge1xyXG4gICAgICAgICAgaWYgKGVycm9yKSByZWplY3QoZXJyb3IpO1xyXG4gICAgICAgICAgZWxzZSByZXNvbHZlKHJlc3VsdCk7XHJcbiAgICAgICAgfVxyXG4gICAgICApXHJcbiAgICAgIC5lbmQoYnVmZmVyKTtcclxuICB9KTtcclxuICBjb25zdCBzb2NpYWwgPSBhd2FpdCBTb2NpYWwuY3JlYXRlKHsgcGxhdGZvcm06IFN0cmluZyhwbGF0Zm9ybSksIHVybDogU3RyaW5nKHVybCksIGljb246IHVwbG9hZC5zZWN1cmVfdXJsIH0pO1xyXG4gIHJldHVybiBOZXh0UmVzcG9uc2UuanNvbihzb2NpYWwsIHsgc3RhdHVzOiAyMDEgfSk7XHJcbn1cclxuXHJcbmV4cG9ydCBhc3luYyBmdW5jdGlvbiBQVVQocmVxOiBOZXh0UmVxdWVzdCkge1xyXG4gIGF3YWl0IGRiQ29ubmVjdCgpO1xyXG4gIGNvbnN0IGNvbnRlbnRUeXBlID0gcmVxLmhlYWRlcnMuZ2V0KFwiY29udGVudC10eXBlXCIpIHx8IFwiXCI7XHJcbiAgaWYgKCFjb250ZW50VHlwZS5zdGFydHNXaXRoKFwibXVsdGlwYXJ0L2Zvcm0tZGF0YVwiKSkge1xyXG4gICAgcmV0dXJuIE5leHRSZXNwb25zZS5qc29uKHsgbWVzc2FnZTogXCJJbnZhbGlkIGNvbnRlbnQgdHlwZVwiIH0sIHsgc3RhdHVzOiA0MDAgfSk7XHJcbiAgfVxyXG4gIGNvbnN0IGZvcm1EYXRhID0gYXdhaXQgcmVxLmZvcm1EYXRhKCk7XHJcbiAgY29uc3QgaWQgPSBmb3JtRGF0YS5nZXQoXCJpZFwiKTtcclxuICBjb25zdCBwbGF0Zm9ybSA9IGZvcm1EYXRhLmdldChcInBsYXRmb3JtXCIpO1xyXG4gIGNvbnN0IHVybCA9IGZvcm1EYXRhLmdldChcInVybFwiKTtcclxuICBjb25zdCBmaWxlID0gZm9ybURhdGEuZ2V0KFwiaWNvblwiKTtcclxuICBpZiAoIWlkKSB7XHJcbiAgICByZXR1cm4gTmV4dFJlc3BvbnNlLmpzb24oeyBtZXNzYWdlOiBcIklEIGlzIHJlcXVpcmVkXCIgfSwgeyBzdGF0dXM6IDQwMCB9KTtcclxuICB9XHJcbiAgY29uc3Qgc29jaWFsID0gYXdhaXQgU29jaWFsLmZpbmRCeUlkKGlkKTtcclxuICBpZiAoIXNvY2lhbCkge1xyXG4gICAgcmV0dXJuIE5leHRSZXNwb25zZS5qc29uKHsgbWVzc2FnZTogXCJTb2NpYWwgbm90IGZvdW5kXCIgfSwgeyBzdGF0dXM6IDQwNCB9KTtcclxuICB9XHJcbiAgaWYgKHBsYXRmb3JtKSBzb2NpYWwucGxhdGZvcm0gPSBTdHJpbmcocGxhdGZvcm0pO1xyXG4gIGlmICh1cmwpIHNvY2lhbC51cmwgPSBTdHJpbmcodXJsKTtcclxuICBpZiAoZmlsZSAmJiB0eXBlb2YgZmlsZSAhPT0gXCJzdHJpbmdcIikge1xyXG4gICAgY29uc3QgYXJyYXlCdWZmZXIgPSBhd2FpdCBmaWxlLmFycmF5QnVmZmVyKCk7XHJcbiAgICBjb25zdCBidWZmZXIgPSBCdWZmZXIuZnJvbShhcnJheUJ1ZmZlcik7XHJcbiAgICBjb25zdCB1cGxvYWQgPSBhd2FpdCBuZXcgUHJvbWlzZTxhbnk+KChyZXNvbHZlLCByZWplY3QpID0+IHtcclxuICAgICAgY2xvdWRpbmFyeS51cGxvYWRlclxyXG4gICAgICAgIC51cGxvYWRfc3RyZWFtKFxyXG4gICAgICAgICAge1xyXG4gICAgICAgICAgICBmb2xkZXI6IFwic29jaWFsc1wiLFxyXG4gICAgICAgICAgICByZXNvdXJjZV90eXBlOiBcImltYWdlXCIsXHJcbiAgICAgICAgICAgIGFsbG93ZWRfZm9ybWF0czogW1wianBnXCIsIFwianBlZ1wiLCBcInBuZ1wiLCBcIndlYnBcIl0sXHJcbiAgICAgICAgICB9LFxyXG4gICAgICAgICAgKGVycm9yLCByZXN1bHQpID0+IHtcclxuICAgICAgICAgICAgaWYgKGVycm9yKSByZWplY3QoZXJyb3IpO1xyXG4gICAgICAgICAgICBlbHNlIHJlc29sdmUocmVzdWx0KTtcclxuICAgICAgICAgIH1cclxuICAgICAgICApXHJcbiAgICAgICAgLmVuZChidWZmZXIpO1xyXG4gICAgfSk7XHJcbiAgICBzb2NpYWwuaWNvbiA9IHVwbG9hZC5zZWN1cmVfdXJsO1xyXG4gIH1cclxuICBjb25zdCB1cGRhdGVkID0gYXdhaXQgc29jaWFsLnNhdmUoKTtcclxuICByZXR1cm4gTmV4dFJlc3BvbnNlLmpzb24odXBkYXRlZCk7XHJcbn1cclxuXHJcbmV4cG9ydCBhc3luYyBmdW5jdGlvbiBERUxFVEUocmVxOiBOZXh0UmVxdWVzdCkge1xyXG4gIGF3YWl0IGRiQ29ubmVjdCgpO1xyXG4gIGNvbnN0IHsgaWQgfSA9IGF3YWl0IHJlcS5qc29uKCk7XHJcbiAgY29uc3QgZGVsZXRlZCA9IGF3YWl0IFNvY2lhbC5maW5kQnlJZEFuZERlbGV0ZShpZCk7XHJcbiAgaWYgKCFkZWxldGVkKSB7XHJcbiAgICByZXR1cm4gTmV4dFJlc3BvbnNlLmpzb24oeyBtZXNzYWdlOiBcIlNvY2lhbCBub3QgZm91bmRcIiB9LCB7IHN0YXR1czogNDA0IH0pO1xyXG4gIH1cclxuICByZXR1cm4gTmV4dFJlc3BvbnNlLmpzb24oeyBtZXNzYWdlOiBcIlNvY2lhbCBkZWxldGVkIHN1Y2Nlc3NmdWxseVwiIH0pO1xyXG59XHJcbiJdLCJuYW1lcyI6WyJOZXh0UmVzcG9uc2UiLCJkYkNvbm5lY3QiLCJTb2NpYWwiLCJjbG91ZGluYXJ5IiwicnVudGltZSIsIkdFVCIsInNvY2lhbHMiLCJmaW5kIiwianNvbiIsIlBPU1QiLCJyZXEiLCJjb250ZW50VHlwZSIsImhlYWRlcnMiLCJnZXQiLCJzdGFydHNXaXRoIiwibWVzc2FnZSIsInN0YXR1cyIsImZvcm1EYXRhIiwicGxhdGZvcm0iLCJ1cmwiLCJmaWxlIiwiYXJyYXlCdWZmZXIiLCJidWZmZXIiLCJCdWZmZXIiLCJmcm9tIiwidXBsb2FkIiwiUHJvbWlzZSIsInJlc29sdmUiLCJyZWplY3QiLCJ1cGxvYWRlciIsInVwbG9hZF9zdHJlYW0iLCJmb2xkZXIiLCJyZXNvdXJjZV90eXBlIiwiYWxsb3dlZF9mb3JtYXRzIiwiZXJyb3IiLCJyZXN1bHQiLCJlbmQiLCJzb2NpYWwiLCJjcmVhdGUiLCJTdHJpbmciLCJpY29uIiwic2VjdXJlX3VybCIsIlBVVCIsImlkIiwiZmluZEJ5SWQiLCJ1cGRhdGVkIiwic2F2ZSIsIkRFTEVURSIsImRlbGV0ZWQiLCJmaW5kQnlJZEFuZERlbGV0ZSJdLCJpZ25vcmVMaXN0IjpbXSwic291cmNlUm9vdCI6IiJ9\n//# sourceURL=webpack-internal:///(rsc)/./app/api/socials/route.ts\n");

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

/***/ "(rsc)/./lib/models/Social.ts":
/*!******************************!*\
  !*** ./lib/models/Social.ts ***!
  \******************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export */ __webpack_require__.d(__webpack_exports__, {\n/* harmony export */   \"default\": () => (__WEBPACK_DEFAULT_EXPORT__)\n/* harmony export */ });\n/* harmony import */ var mongoose__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! mongoose */ \"mongoose\");\n/* harmony import */ var mongoose__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(mongoose__WEBPACK_IMPORTED_MODULE_0__);\n\nconst SocialSchema = new mongoose__WEBPACK_IMPORTED_MODULE_0__.Schema({\n    platform: {\n        type: String,\n        required: true\n    },\n    url: {\n        type: String,\n        required: true\n    },\n    icon: {\n        type: String\n    }\n}, {\n    timestamps: true\n});\nconst Social = mongoose__WEBPACK_IMPORTED_MODULE_0__.models.Social || (0,mongoose__WEBPACK_IMPORTED_MODULE_0__.model)(\"Social\", SocialSchema);\n/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (Social);\n//# sourceURL=[module]\n//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiKHJzYykvLi9saWIvbW9kZWxzL1NvY2lhbC50cyIsIm1hcHBpbmdzIjoiOzs7Ozs7QUFBMkQ7QUFFM0QsTUFBTUcsZUFBZSxJQUFJSCw0Q0FBTUEsQ0FDN0I7SUFDRUksVUFBVTtRQUFFQyxNQUFNQztRQUFRQyxVQUFVO0lBQUs7SUFDekNDLEtBQUs7UUFBRUgsTUFBTUM7UUFBUUMsVUFBVTtJQUFLO0lBQ3BDRSxNQUFNO1FBQUVKLE1BQU1DO0lBQU87QUFDdkIsR0FDQTtJQUFFSSxZQUFZO0FBQUs7QUFHckIsTUFBTUMsU0FBU1YsNENBQU1BLENBQUNVLE1BQU0sSUFBSVQsK0NBQUtBLENBQUMsVUFBVUM7QUFFaEQsaUVBQWVRLE1BQU1BLEVBQUMiLCJzb3VyY2VzIjpbIkM6XFxVc2Vyc1xcc3RlcGhhbmllXFxEb2N1bWVudHNcXEI1NTAgTUNQIE1FUk5cXFdlYlBvcnRmb2xpb1xcbXktcG9ydGZvbGlvLWNsaWVudFxcbGliXFxtb2RlbHNcXFNvY2lhbC50cyJdLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgbW9uZ29vc2UsIHsgU2NoZW1hLCBtb2RlbHMsIG1vZGVsIH0gZnJvbSBcIm1vbmdvb3NlXCI7XHJcblxyXG5jb25zdCBTb2NpYWxTY2hlbWEgPSBuZXcgU2NoZW1hKFxyXG4gIHtcclxuICAgIHBsYXRmb3JtOiB7IHR5cGU6IFN0cmluZywgcmVxdWlyZWQ6IHRydWUgfSxcclxuICAgIHVybDogeyB0eXBlOiBTdHJpbmcsIHJlcXVpcmVkOiB0cnVlIH0sXHJcbiAgICBpY29uOiB7IHR5cGU6IFN0cmluZyB9LFxyXG4gIH0sXHJcbiAgeyB0aW1lc3RhbXBzOiB0cnVlIH1cclxuKTtcclxuXHJcbmNvbnN0IFNvY2lhbCA9IG1vZGVscy5Tb2NpYWwgfHwgbW9kZWwoXCJTb2NpYWxcIiwgU29jaWFsU2NoZW1hKTtcclxuXHJcbmV4cG9ydCBkZWZhdWx0IFNvY2lhbDtcclxuIl0sIm5hbWVzIjpbIlNjaGVtYSIsIm1vZGVscyIsIm1vZGVsIiwiU29jaWFsU2NoZW1hIiwicGxhdGZvcm0iLCJ0eXBlIiwiU3RyaW5nIiwicmVxdWlyZWQiLCJ1cmwiLCJpY29uIiwidGltZXN0YW1wcyIsIlNvY2lhbCJdLCJpZ25vcmVMaXN0IjpbXSwic291cmNlUm9vdCI6IiJ9\n//# sourceURL=webpack-internal:///(rsc)/./lib/models/Social.ts\n");

/***/ }),

/***/ "(rsc)/./node_modules/next/dist/build/webpack/loaders/next-app-loader/index.js?name=app%2Fapi%2Fsocials%2Froute&page=%2Fapi%2Fsocials%2Froute&appPaths=&pagePath=private-next-app-dir%2Fapi%2Fsocials%2Froute.ts&appDir=C%3A%5CUsers%5Cstephanie%5CDocuments%5CB550%20MCP%20MERN%5CWebPortfolio%5Cmy-portfolio-client%5Capp&pageExtensions=tsx&pageExtensions=ts&pageExtensions=jsx&pageExtensions=js&rootDir=C%3A%5CUsers%5Cstephanie%5CDocuments%5CB550%20MCP%20MERN%5CWebPortfolio%5Cmy-portfolio-client&isDev=true&tsconfigPath=tsconfig.json&basePath=&assetPrefix=&nextConfigOutput=&preferredRegion=&middlewareConfig=e30%3D!":
/*!*************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************!*\
  !*** ./node_modules/next/dist/build/webpack/loaders/next-app-loader/index.js?name=app%2Fapi%2Fsocials%2Froute&page=%2Fapi%2Fsocials%2Froute&appPaths=&pagePath=private-next-app-dir%2Fapi%2Fsocials%2Froute.ts&appDir=C%3A%5CUsers%5Cstephanie%5CDocuments%5CB550%20MCP%20MERN%5CWebPortfolio%5Cmy-portfolio-client%5Capp&pageExtensions=tsx&pageExtensions=ts&pageExtensions=jsx&pageExtensions=js&rootDir=C%3A%5CUsers%5Cstephanie%5CDocuments%5CB550%20MCP%20MERN%5CWebPortfolio%5Cmy-portfolio-client&isDev=true&tsconfigPath=tsconfig.json&basePath=&assetPrefix=&nextConfigOutput=&preferredRegion=&middlewareConfig=e30%3D! ***!
  \*************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export */ __webpack_require__.d(__webpack_exports__, {\n/* harmony export */   patchFetch: () => (/* binding */ patchFetch),\n/* harmony export */   routeModule: () => (/* binding */ routeModule),\n/* harmony export */   serverHooks: () => (/* binding */ serverHooks),\n/* harmony export */   workAsyncStorage: () => (/* binding */ workAsyncStorage),\n/* harmony export */   workUnitAsyncStorage: () => (/* binding */ workUnitAsyncStorage)\n/* harmony export */ });\n/* harmony import */ var next_dist_server_route_modules_app_route_module_compiled__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! next/dist/server/route-modules/app-route/module.compiled */ \"(rsc)/./node_modules/next/dist/server/route-modules/app-route/module.compiled.js\");\n/* harmony import */ var next_dist_server_route_modules_app_route_module_compiled__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(next_dist_server_route_modules_app_route_module_compiled__WEBPACK_IMPORTED_MODULE_0__);\n/* harmony import */ var next_dist_server_route_kind__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! next/dist/server/route-kind */ \"(rsc)/./node_modules/next/dist/server/route-kind.js\");\n/* harmony import */ var next_dist_server_lib_patch_fetch__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! next/dist/server/lib/patch-fetch */ \"(rsc)/./node_modules/next/dist/server/lib/patch-fetch.js\");\n/* harmony import */ var next_dist_server_lib_patch_fetch__WEBPACK_IMPORTED_MODULE_2___default = /*#__PURE__*/__webpack_require__.n(next_dist_server_lib_patch_fetch__WEBPACK_IMPORTED_MODULE_2__);\n/* harmony import */ var C_Users_stephanie_Documents_B550_MCP_MERN_WebPortfolio_my_portfolio_client_app_api_socials_route_ts__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./app/api/socials/route.ts */ \"(rsc)/./app/api/socials/route.ts\");\n\n\n\n\n// We inject the nextConfigOutput here so that we can use them in the route\n// module.\nconst nextConfigOutput = \"\"\nconst routeModule = new next_dist_server_route_modules_app_route_module_compiled__WEBPACK_IMPORTED_MODULE_0__.AppRouteRouteModule({\n    definition: {\n        kind: next_dist_server_route_kind__WEBPACK_IMPORTED_MODULE_1__.RouteKind.APP_ROUTE,\n        page: \"/api/socials/route\",\n        pathname: \"/api/socials\",\n        filename: \"route\",\n        bundlePath: \"app/api/socials/route\"\n    },\n    resolvedPagePath: \"C:\\\\Users\\\\stephanie\\\\Documents\\\\B550 MCP MERN\\\\WebPortfolio\\\\my-portfolio-client\\\\app\\\\api\\\\socials\\\\route.ts\",\n    nextConfigOutput,\n    userland: C_Users_stephanie_Documents_B550_MCP_MERN_WebPortfolio_my_portfolio_client_app_api_socials_route_ts__WEBPACK_IMPORTED_MODULE_3__\n});\n// Pull out the exports that we need to expose from the module. This should\n// be eliminated when we've moved the other routes to the new format. These\n// are used to hook into the route.\nconst { workAsyncStorage, workUnitAsyncStorage, serverHooks } = routeModule;\nfunction patchFetch() {\n    return (0,next_dist_server_lib_patch_fetch__WEBPACK_IMPORTED_MODULE_2__.patchFetch)({\n        workAsyncStorage,\n        workUnitAsyncStorage\n    });\n}\n\n\n//# sourceMappingURL=app-route.js.map//# sourceURL=[module]\n//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiKHJzYykvLi9ub2RlX21vZHVsZXMvbmV4dC9kaXN0L2J1aWxkL3dlYnBhY2svbG9hZGVycy9uZXh0LWFwcC1sb2FkZXIvaW5kZXguanM/bmFtZT1hcHAlMkZhcGklMkZzb2NpYWxzJTJGcm91dGUmcGFnZT0lMkZhcGklMkZzb2NpYWxzJTJGcm91dGUmYXBwUGF0aHM9JnBhZ2VQYXRoPXByaXZhdGUtbmV4dC1hcHAtZGlyJTJGYXBpJTJGc29jaWFscyUyRnJvdXRlLnRzJmFwcERpcj1DJTNBJTVDVXNlcnMlNUNzdGVwaGFuaWUlNUNEb2N1bWVudHMlNUNCNTUwJTIwTUNQJTIwTUVSTiU1Q1dlYlBvcnRmb2xpbyU1Q215LXBvcnRmb2xpby1jbGllbnQlNUNhcHAmcGFnZUV4dGVuc2lvbnM9dHN4JnBhZ2VFeHRlbnNpb25zPXRzJnBhZ2VFeHRlbnNpb25zPWpzeCZwYWdlRXh0ZW5zaW9ucz1qcyZyb290RGlyPUMlM0ElNUNVc2VycyU1Q3N0ZXBoYW5pZSU1Q0RvY3VtZW50cyU1Q0I1NTAlMjBNQ1AlMjBNRVJOJTVDV2ViUG9ydGZvbGlvJTVDbXktcG9ydGZvbGlvLWNsaWVudCZpc0Rldj10cnVlJnRzY29uZmlnUGF0aD10c2NvbmZpZy5qc29uJmJhc2VQYXRoPSZhc3NldFByZWZpeD0mbmV4dENvbmZpZ091dHB1dD0mcHJlZmVycmVkUmVnaW9uPSZtaWRkbGV3YXJlQ29uZmlnPWUzMCUzRCEiLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7Ozs7QUFBK0Y7QUFDdkM7QUFDcUI7QUFDOEQ7QUFDM0k7QUFDQTtBQUNBO0FBQ0Esd0JBQXdCLHlHQUFtQjtBQUMzQztBQUNBLGNBQWMsa0VBQVM7QUFDdkI7QUFDQTtBQUNBO0FBQ0E7QUFDQSxLQUFLO0FBQ0w7QUFDQTtBQUNBLFlBQVk7QUFDWixDQUFDO0FBQ0Q7QUFDQTtBQUNBO0FBQ0EsUUFBUSxzREFBc0Q7QUFDOUQ7QUFDQSxXQUFXLDRFQUFXO0FBQ3RCO0FBQ0E7QUFDQSxLQUFLO0FBQ0w7QUFDMEY7O0FBRTFGIiwic291cmNlcyI6WyIiXSwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHsgQXBwUm91dGVSb3V0ZU1vZHVsZSB9IGZyb20gXCJuZXh0L2Rpc3Qvc2VydmVyL3JvdXRlLW1vZHVsZXMvYXBwLXJvdXRlL21vZHVsZS5jb21waWxlZFwiO1xuaW1wb3J0IHsgUm91dGVLaW5kIH0gZnJvbSBcIm5leHQvZGlzdC9zZXJ2ZXIvcm91dGUta2luZFwiO1xuaW1wb3J0IHsgcGF0Y2hGZXRjaCBhcyBfcGF0Y2hGZXRjaCB9IGZyb20gXCJuZXh0L2Rpc3Qvc2VydmVyL2xpYi9wYXRjaC1mZXRjaFwiO1xuaW1wb3J0ICogYXMgdXNlcmxhbmQgZnJvbSBcIkM6XFxcXFVzZXJzXFxcXHN0ZXBoYW5pZVxcXFxEb2N1bWVudHNcXFxcQjU1MCBNQ1AgTUVSTlxcXFxXZWJQb3J0Zm9saW9cXFxcbXktcG9ydGZvbGlvLWNsaWVudFxcXFxhcHBcXFxcYXBpXFxcXHNvY2lhbHNcXFxccm91dGUudHNcIjtcbi8vIFdlIGluamVjdCB0aGUgbmV4dENvbmZpZ091dHB1dCBoZXJlIHNvIHRoYXQgd2UgY2FuIHVzZSB0aGVtIGluIHRoZSByb3V0ZVxuLy8gbW9kdWxlLlxuY29uc3QgbmV4dENvbmZpZ091dHB1dCA9IFwiXCJcbmNvbnN0IHJvdXRlTW9kdWxlID0gbmV3IEFwcFJvdXRlUm91dGVNb2R1bGUoe1xuICAgIGRlZmluaXRpb246IHtcbiAgICAgICAga2luZDogUm91dGVLaW5kLkFQUF9ST1VURSxcbiAgICAgICAgcGFnZTogXCIvYXBpL3NvY2lhbHMvcm91dGVcIixcbiAgICAgICAgcGF0aG5hbWU6IFwiL2FwaS9zb2NpYWxzXCIsXG4gICAgICAgIGZpbGVuYW1lOiBcInJvdXRlXCIsXG4gICAgICAgIGJ1bmRsZVBhdGg6IFwiYXBwL2FwaS9zb2NpYWxzL3JvdXRlXCJcbiAgICB9LFxuICAgIHJlc29sdmVkUGFnZVBhdGg6IFwiQzpcXFxcVXNlcnNcXFxcc3RlcGhhbmllXFxcXERvY3VtZW50c1xcXFxCNTUwIE1DUCBNRVJOXFxcXFdlYlBvcnRmb2xpb1xcXFxteS1wb3J0Zm9saW8tY2xpZW50XFxcXGFwcFxcXFxhcGlcXFxcc29jaWFsc1xcXFxyb3V0ZS50c1wiLFxuICAgIG5leHRDb25maWdPdXRwdXQsXG4gICAgdXNlcmxhbmRcbn0pO1xuLy8gUHVsbCBvdXQgdGhlIGV4cG9ydHMgdGhhdCB3ZSBuZWVkIHRvIGV4cG9zZSBmcm9tIHRoZSBtb2R1bGUuIFRoaXMgc2hvdWxkXG4vLyBiZSBlbGltaW5hdGVkIHdoZW4gd2UndmUgbW92ZWQgdGhlIG90aGVyIHJvdXRlcyB0byB0aGUgbmV3IGZvcm1hdC4gVGhlc2Vcbi8vIGFyZSB1c2VkIHRvIGhvb2sgaW50byB0aGUgcm91dGUuXG5jb25zdCB7IHdvcmtBc3luY1N0b3JhZ2UsIHdvcmtVbml0QXN5bmNTdG9yYWdlLCBzZXJ2ZXJIb29rcyB9ID0gcm91dGVNb2R1bGU7XG5mdW5jdGlvbiBwYXRjaEZldGNoKCkge1xuICAgIHJldHVybiBfcGF0Y2hGZXRjaCh7XG4gICAgICAgIHdvcmtBc3luY1N0b3JhZ2UsXG4gICAgICAgIHdvcmtVbml0QXN5bmNTdG9yYWdlXG4gICAgfSk7XG59XG5leHBvcnQgeyByb3V0ZU1vZHVsZSwgd29ya0FzeW5jU3RvcmFnZSwgd29ya1VuaXRBc3luY1N0b3JhZ2UsIHNlcnZlckhvb2tzLCBwYXRjaEZldGNoLCAgfTtcblxuLy8jIHNvdXJjZU1hcHBpbmdVUkw9YXBwLXJvdXRlLmpzLm1hcCJdLCJuYW1lcyI6W10sImlnbm9yZUxpc3QiOltdLCJzb3VyY2VSb290IjoiIn0=\n//# sourceURL=webpack-internal:///(rsc)/./node_modules/next/dist/build/webpack/loaders/next-app-loader/index.js?name=app%2Fapi%2Fsocials%2Froute&page=%2Fapi%2Fsocials%2Froute&appPaths=&pagePath=private-next-app-dir%2Fapi%2Fsocials%2Froute.ts&appDir=C%3A%5CUsers%5Cstephanie%5CDocuments%5CB550%20MCP%20MERN%5CWebPortfolio%5Cmy-portfolio-client%5Capp&pageExtensions=tsx&pageExtensions=ts&pageExtensions=jsx&pageExtensions=js&rootDir=C%3A%5CUsers%5Cstephanie%5CDocuments%5CB550%20MCP%20MERN%5CWebPortfolio%5Cmy-portfolio-client&isDev=true&tsconfigPath=tsconfig.json&basePath=&assetPrefix=&nextConfigOutput=&preferredRegion=&middlewareConfig=e30%3D!\n");

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
var __webpack_exports__ = __webpack_require__.X(0, ["vendor-chunks/next","vendor-chunks/lodash","vendor-chunks/cloudinary","vendor-chunks/q"], () => (__webpack_exec__("(rsc)/./node_modules/next/dist/build/webpack/loaders/next-app-loader/index.js?name=app%2Fapi%2Fsocials%2Froute&page=%2Fapi%2Fsocials%2Froute&appPaths=&pagePath=private-next-app-dir%2Fapi%2Fsocials%2Froute.ts&appDir=C%3A%5CUsers%5Cstephanie%5CDocuments%5CB550%20MCP%20MERN%5CWebPortfolio%5Cmy-portfolio-client%5Capp&pageExtensions=tsx&pageExtensions=ts&pageExtensions=jsx&pageExtensions=js&rootDir=C%3A%5CUsers%5Cstephanie%5CDocuments%5CB550%20MCP%20MERN%5CWebPortfolio%5Cmy-portfolio-client&isDev=true&tsconfigPath=tsconfig.json&basePath=&assetPrefix=&nextConfigOutput=&preferredRegion=&middlewareConfig=e30%3D!")));
module.exports = __webpack_exports__;

})();