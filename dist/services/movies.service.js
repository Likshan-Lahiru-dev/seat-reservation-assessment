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
exports.createMovieWithShows = createMovieWithShows;
exports.listMovies = listMovies;
exports.listShowsByMovie = listShowsByMovie;
const luxon_1 = require("luxon");
const withTransaction_1 = require("../db/withTransaction");
const appError_1 = require("../utils/appError");
const http_1 = require("../utils/http");
const moviesRepo = __importStar(require("../repositories/movies.repo"));
function daysBetweenInclusive(startISO, endISO) {
    const start = luxon_1.DateTime.fromISO(startISO);
    const end = luxon_1.DateTime.fromISO(endISO);
    if (!start.isValid || !end.isValid)
        return [];
    if (end < start)
        return [];
    const days = [];
    let d = start.startOf("day");
    const last = end.startOf("day");
    while (d <= last) {
        days.push(d.toISODate());
        d = d.plus({ days: 1 });
    }
    return days;
}
async function createMovieWithShows(input) {
    const days = daysBetweenInclusive(input.startDate, input.endDate);
    if (days.length === 0) {
        throw new appError_1.AppError({
            status: http_1.HttpStatus.BAD_REQUEST,
            code: "INVALID_DATE_RANGE",
            message: "endDate must be same or after startDate"
        });
    }
    return (0, withTransaction_1.withTransaction)(async (client) => {
        const movie = await moviesRepo.createMovie(client, {
            title: input.title,
            imageUrl: input.imageUrl
        });
        const starts = [];
        const ends = [];
        for (const day of days) {
            for (const t of input.showTimes) {
                const startDT = luxon_1.DateTime.fromISO(`${day}T${t}`, { zone: input.timezone });
                if (!startDT.isValid) {
                    throw new appError_1.AppError({
                        status: http_1.HttpStatus.BAD_REQUEST,
                        code: "INVALID_SHOW_TIME",
                        message: `Invalid show time: ${day} ${t} (${input.timezone})`
                    });
                }
                const endDT = startDT.plus({ minutes: input.durationMinutes });
                starts.push(startDT.toUTC().toISO());
                ends.push(endDT.toUTC().toISO());
            }
        }
        const shows = await moviesRepo.createShowsBulk(client, {
            movieId: movie.id,
            theatreId: input.theatreId,
            starts,
            ends
        });
        return { movie, shows };
    });
}
async function listMovies() {
    return moviesRepo.listMoviesWithShows();
}
async function listShowsByMovie(movieId) {
    return moviesRepo.listShowsByMovie(movieId);
}
