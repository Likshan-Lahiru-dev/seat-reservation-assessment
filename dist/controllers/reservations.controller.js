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
exports.cancelReservation = exports.listReservations = exports.createReservation = void 0;
const http_1 = require("../utils/http");
const reservationsService = __importStar(require("../services/reservations.service"));
const createReservation = async (req, res) => {
    const { body } = req.validated;
    const reservation = await reservationsService.createReservation({
        showId: body.showId,
        seatIds: body.seatIds,
        user: body.user
    });
    res.status(http_1.HttpStatus.CREATED).json(reservation);
};
exports.createReservation = createReservation;
const listReservations = async (req, res) => {
    const { query } = req.validated;
    const result = await reservationsService.listReservations({
        showId: query.showId,
        seatId: query.seatId,
        page: query.page,
        limit: query.limit
    });
    res.status(http_1.HttpStatus.OK).json(result);
};
exports.listReservations = listReservations;
const cancelReservation = async (req, res) => {
    const { params } = req.validated;
    await reservationsService.cancelReservation(params.id);
    res.status(http_1.HttpStatus.NO_CONTENT).send();
};
exports.cancelReservation = cancelReservation;
