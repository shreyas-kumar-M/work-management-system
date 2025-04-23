import Employee from "../models/Employee.js";
import Module from "../models/Module.js";
import Project from "../models/Project.js";
import WorkAssign from "../models/WorkAssign.js";

// ✅ Assign a task to an employee
export const assignWork = async (req, res) => {
    try {
        console.log("Received data:", req.body); // 🛠 Debugging step

        const {
            startDatetime,
            endDatetime,
            expectedCompletionDate,
            userId,
            module_id,
            workType,
            priority,
            status,
            remarks,
            referencePhoto
        } = req.body;

        console.log("Checking Employee:", userId);
        console.log("Checking Module:", module_id);

        const employee = await Employee.findByPk(userId);
        const module = await Module.findByPk(module_id);

        if (!employee || !module) {
            return res.status(400).json({ error: "Invalid Employee or Module ID" });
        }

        const newWork = await WorkAssign.create({
            userId,
            module_id,
            workType,
            start_datetime: startDatetime,  // ✅ Fixing field name
            end_datetime: endDatetime,  // ✅ Fixing field name
            expected_completion_date: expectedCompletionDate,  // ✅ Fixing field name
            priority,
            status,
            remarks,
            reference_photo: referencePhoto
        });

        res.status(201).json(newWork);
    } catch (err) {
        console.error("Error assigning work:", err);
        res.status(500).json({ error: err.message });
    }
};


// ✅ Get all work assignments (with employee & module details)
export const getWorkAssignments = async (req, res) => {
    try {
        const workAssignments = await WorkAssign.findAll({
            include: [
                { model: Employee, attributes: ["firstName", "lastName", "designation"] },
                { model: Module, attributes: ["moduleName"],
                    include: [
                        {
                            model: Project,
                            attributes: ["projectName"], // 👈 Only fetch the name
                        },
                    ],
                    
                },
            ],
        });

        res.json(workAssignments);
    } catch (err) {
        console.error("Error fetching work assignments:", err);
        res.status(500).json({ error: err.message });
    }
};

// ✅ Update work status
export const updateWorkStatus = async (req, res) => {
    try {
        const { id } = req.params;
        const { status } = req.body;

        const work = await WorkAssign.findByPk(id);
        if (!work) return res.status(404).json({ error: "Work not found" });

        work.status = status;
        await work.save();

        res.json({ message: "Work status updated successfully", work });
    } catch (err) {
        console.error("Error updating work status:", err);
        res.status(500).json({ error: err.message });
    }
};

// Update Work Assignment (Full Update)
export const updateWorkAssignment = async (req, res) => {
    try {
      const { id } = req.params;
      const work = await WorkAssign.findByPk(id);
  
      if (!work) return res.status(404).json({ error: "Work not found" });
  
      await work.update(req.body);
      res.json({ message: "Work updated successfully", work });
    } catch (err) {
      console.error("Error updating work:", err);
      res.status(500).json({ error: err.message });
    }
  };

  
  // Get work assignments for a specific employee