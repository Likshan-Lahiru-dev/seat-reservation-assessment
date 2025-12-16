"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
exports.createTheatre = exports.listTheatres = void 0;
const http_1 = require("../utils/http");
const theatresService = __importStar(require("../services/theatres.service"));
const listTheatres = async (_req, res) => {
    const theatres = await theatresService.listTheatres();
    res.status(http_1.HttpStatus.OK).json(theatres);
};
exports.listTheatres = listTheatres;
const createTheatre = async (req, res) => {
    const { body } = req.validated;
    const theatre = await theatresService.createTheatre({
        name: body.name,
        imageUrl: body.imageUrl,
        rating: body.rating,
        location: body.location
    });
    res.status(http_1.HttpStatus.CREATED).json(theatre);
};
exports.createTheatre = createTheatre;
