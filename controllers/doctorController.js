const Doctor = require("../schemas/Doctor");

const updateDoctor = async (req, res) => {
  const { id } = req.paras;
  try {
    const updateDoctor = await Doctor.findByIdAndUpdate(
      id,
      { $set: req.body },
      { new: true }
    );
    res.status(200).json({
      success: true,
      message: "Successfully updated",
      data: updateDoctor,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: "Failed to update" });
  }
};

const deleteDoctor = async (req, res) => {
  const { id } = req.paras;
  try {
    const updateDoctor = await User.findByIdAndDelete(id);
    res.status(200).json({ success: true, message: "Successfully deleted" });
  } catch (error) {
    res.status(500).json({ success: false, message: "Failed to delete" });
  }
};

const getSingleDoctor = async (req, res) => {
  const { id } = req.paras;
  try {
    const doctor = await Doctor.findById(id)
      .populate("reviews")
      .select("-password");
    res
      .status(200)
      .json({ success: true, message: "Doctor found", data: doctor });
  } catch (error) {
    res.status(404).json({ success: false, message: "No doctor found" });
  }
};

const getAllDoctors = async (req, res) => {
  try {
    const { query } = req.query;
    let doctors;

    if (query) {
      doctors = await Doctor.find({
        isApproved: "approved",
        $or: [
          { name: { $regex: query, $options: "i" } },
          { specialization: { $regex: query, $options: "i" } },
        ],
      }).select("-password");
    } else {
      doctors = await Doctor.find({ isApproved: "approved" }).select(
        "-password"
      );
    }

    res
      .status(200)
      .json({ success: true, message: "Doctor found", data: doctors });
  } catch (error) {
    res.status(404).json({ success: false, message: "Not found" });
  }
};

module.exports = { updateDoctor, deleteDoctor, getAllDoctors, getSingleDoctor };
