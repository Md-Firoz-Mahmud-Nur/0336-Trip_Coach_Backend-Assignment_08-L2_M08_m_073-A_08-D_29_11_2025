import { deleteImageFromCLoudinary } from "../../config/cloudinary.config";
import { QueryBuilder } from "../../utils/QueryBuilder";
import { packageSearchableFields } from "./package.constant";
import { IPackage, IPackageType } from "./package.interface";
import { Package, PackageType } from "./package.model";

const createPackage = async (payload: IPackage) => {
  const existing = await Package.findOne({ title: payload.title });
  if (existing) throw new Error("A package with this title already exists.");

  if (payload.capacity && !payload.availableSeats)
    payload.availableSeats = payload.capacity;

  const created = await Package.create(payload);
  return created;
};

const getAllPackages = async (query: Record<string, string>) => {
  const qb = new QueryBuilder(Package.find(), query);
  const packagesQuery = qb
    .search(packageSearchableFields)
    .filter()
    .sort()
    .fields()
    .paginate();

  const [data, meta] = await Promise.all([packagesQuery.build(), qb.getMeta()]);

  return { data, meta };
};

const getSinglePackage = async (id: string) => {
  const pkg = await Package.findById(id).populate("packageType").lean();
  if (!pkg) throw new Error("Package not found.");
  return pkg;
};

const updatePackage = async (id: string, payload: Partial<IPackage>) => {
  const existing = await Package.findById(id);
  if (!existing) throw new Error("Package not found.");

  if (payload.images && payload.images.length > 0) {
    payload.images = [...(existing.images || []), ...payload.images];
  }

  if (payload.deleteImages && payload.deleteImages.length > 0) {
    const remaining = (existing.images || []).filter(
      (u) => !payload.deleteImages?.includes(u)
    );
    const newImgs = (payload.images || []).filter(
      (i) => !payload.deleteImages?.includes(i)
    );
    payload.images = [...remaining, ...newImgs];
  }

  const updated = await Package.findByIdAndUpdate(id, payload, { new: true });

  if (payload.deleteImages && payload.deleteImages.length > 0) {
    await Promise.all(
      payload.deleteImages.map((url) => deleteImageFromCLoudinary(url))
    );
  }

  return updated;
};

const deletePackage = async (id: string) => {
  const existing = await Package.findById(id);
  if (!existing) throw new Error("Package not found.");
  if (existing.images && existing.images.length > 0) {
    await Promise.all(
      existing.images.map((url) => deleteImageFromCLoudinary(url))
    );
  }
  return await Package.findByIdAndDelete(id);
};

const createPackageType = async (payload: IPackageType) => {
  const exist = await PackageType.findOne({ name: payload.name });
  if (exist) throw new Error("Package type already exists.");
  return await PackageType.create(payload);
};

const getAllPackageTypes = async (query: Record<string, string>) => {
  const qb = new QueryBuilder(PackageType.find(), query);
  const typesQuery = qb.search(["name"]).filter().sort().fields().paginate();
  const [data, meta] = await Promise.all([typesQuery.build(), qb.getMeta()]);
  return { data, meta };
};

const updatePackageType = async (
  id: string,
  payload: Partial<IPackageType>
) => {
  const exist = await PackageType.findById(id);
  if (!exist) throw new Error("Package type not found.");

  // prevent duplicate name
  if (payload.name) {
    const nameExists = await PackageType.findOne({
      name: payload.name,
      _id: { $ne: id },
    });

    if (nameExists) throw new Error("Package type name already exists.");
  }

  const result = await PackageType.findByIdAndUpdate(id, payload, {
    new: true,
    runValidators: true,
  });

  return result;
};

const deletePackageType = async (id: string) => {
  const exist = await PackageType.findById(id);
  if (!exist) throw new Error("Package type not found.");

  const result = await PackageType.findByIdAndDelete(id);
  return result;
};

const getPackageStats = async () => {
  const totalPackages = await Package.countDocuments();
  const totalTypes = await PackageType.countDocuments();

  const upcoming = await Package.countDocuments({
    startDate: { $gte: new Date() },
  });
  const past = await Package.countDocuments({ endDate: { $lte: new Date() } });

  const avgCostAgg = await Package.aggregate([
    { $group: { _id: null, avg: { $avg: "$costFrom" } } },
  ]);
  const avgCost = avgCostAgg.length ? avgCostAgg[0].avg : 0;

  const topExpensive = await Package.find()
    .sort({ costFrom: -1 })
    .limit(5)
    .select("title costFrom slug");

  return {
    totalPackages,
    totalTypes,
    upcoming,
    past,
    averageCost: avgCost,
    topExpensive,
  };
};

export const PackageService = {
  createPackage,
  getAllPackages,
  getSinglePackage,
  updatePackage,
  deletePackage,
  createPackageType,
  getAllPackageTypes,
  getPackageStats,
  updatePackageType,
  deletePackageType,
};
