import { Request, Response } from "express";
import { catchAsync } from "../../utils/catchAsync";
import { sendResponse } from "../../utils/sendResponse";
import { IPackage, IPackageType } from "./package.interface";
import { Package } from "./package.model";
import { PackageService } from "./package.service";

const createPackage = catchAsync(async (req: Request, res: Response) => {
  const payload: IPackage = req.body;

  const result = await PackageService.createPackage(payload);
  sendResponse(res, {
    statusCode: 201,
    success: true,
    message: "Package created successfully",
    data: result,
  });
});

const getAllPackages = catchAsync(async (req: Request, res: Response) => {
  const resData = await PackageService.getAllPackages(
    req.query as Record<string, string>
  );

  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: "Packages retrieved successfully",
    data: resData.data,
    meta: resData.meta,
  });
});

const getMyPackages = catchAsync(async (req, res) => {
  const guideId = req.params.id;
  const packages = await Package.find({ guide: guideId });
  res.json({ data: packages });
});

const getSinglePackage = catchAsync(async (req: Request, res: Response) => {
  const id = req.params.id;
  const result = await PackageService.getSinglePackage(id);

  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: "Package retrieved successfully",
    data: result,
  });
});

const updatePackage = catchAsync(async (req: Request, res: Response) => {
  const { id } = req.params;
  const payload: Partial<IPackage> = req.body;
  const result = await PackageService.updatePackage(id, payload);

  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: "Package updated successfully",
    data: result,
  });
});

const deletePackage = catchAsync(async (req: Request, res: Response) => {
  const { id } = req.params;
  const result = await PackageService.deletePackage(id);

  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: "Package deleted successfully",
    data: result,
  });
});

const createPackageType = catchAsync(async (req: Request, res: Response) => {
  const payload: IPackageType = req.body;
  const result = await PackageService.createPackageType(payload);
  sendResponse(res, {
    statusCode: 201,
    success: true,
    message: "Package type created successfully",
    data: result,
  });
});

const getAllPackageTypes = catchAsync(async (req: Request, res: Response) => {
  const result = await PackageService.getAllPackageTypes(
    req.query as Record<string, string>
  );
  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: "Package types retrieved successfully",
    data: result.data,
    meta: result.meta,
  });
});

const updatePackageType = catchAsync(async (req: Request, res: Response) => {
  const id = req.params.id;
  const payload: Partial<IPackageType> = req.body;

  const result = await PackageService.updatePackageType(id, payload);

  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: "Package type updated successfully",
    data: result,
  });
});

const deletePackageType = catchAsync(async (req: Request, res: Response) => {
  const id = req.params.id;

  const result = await PackageService.deletePackageType(id);

  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: "Package type deleted successfully",
    data: result,
  });
});

const getPackageStats = catchAsync(async (req: Request, res: Response) => {
  const result = await PackageService.getPackageStats();

  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: "Package stats retrieved successfully",
    data: result,
  });
});

export const PackageController = {
  createPackage,
  getAllPackages,
  getMyPackages,
  getSinglePackage,
  updatePackage,
  deletePackage,
  createPackageType,
  getAllPackageTypes,
  getPackageStats,
  updatePackageType,
  deletePackageType,
};
