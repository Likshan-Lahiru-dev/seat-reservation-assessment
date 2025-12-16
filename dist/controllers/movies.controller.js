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
exports.listShowsByMovie = exports.listMovies = exports.createMovie = void 0;
const http_1 = require("../utils/http");
const moviesService = __importStar(require("../services/movies.service"));
const createMovie = async (req, res) => {
    const { body } = req.validated;
    const result = await moviesService.createMovieWithShows({
        title: body.title,
        imageUrl: body.imageUrl,
        theatreId: body.theatreId,
        startDate: body.startDate,
        endDate: body.endDate,
        showTimes: body.showTimes,
        durationMinutes: body.durationMinutes,
        timezone: body.timezone
    });
    res.status(http_1.HttpStatus.CREATED).json(result);
};
exports.createMovie = createMovie;
const listMovies = async (_req, res) => {
    console.log("coming to list movies controller");
    const movies = await moviesService.listMovies();
    res.status(http_1.HttpStatus.OK).json(movies);
};
exports.listMovies = listMovies;
const listShowsByMovie = async (req, res) => {
    const { params } = req.validated;
    const shows = await moviesService.listShowsByMovie(params.id);
    res.status(http_1.HttpStatus.OK).json(shows);
};
exports.listShowsByMovie = listShowsByMovie;
