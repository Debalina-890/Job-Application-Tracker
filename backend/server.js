const express = require("express");
const { ObjectId } = require("mongodb");
const cors = require("cors");
require("dotenv").config();

const connectDB = require("./db");

const app = express();
app.use(cors());
app.use(express.json());
const PORT = 5000;

async function startServer() {

    try {

        const database = await connectDB();
        const applications = database.collection("applications");

        app.put("/api/applications/:id", async function(req, res) {

    try {

        const id = req.params.id;

        const updatedApplication = req.body;

        await applications.updateOne(
            { _id: new ObjectId(id) },
            { $set: updatedApplication }
        );

        res.json({
            message: "Application updated successfully!"
        });

    } catch (error) {

        res.status(500).json({
            message: "Failed to update application"
        });

    }

});


    app.delete("/api/applications/:id", async function(req, res) {

    try {

        const id = req.params.id;

        await applications.deleteOne(
            { _id: new ObjectId(id) }
        );

        res.json({
            message: "Application deleted successfully!"
        });

    } catch (error) {

        res.status(500).json({
            message: "Failed to delete application"
        });

    }

    });


        app.get("/api/applications", async function(req, res) {

        try {

            const data = await applications.find().toArray();

            res.json(data);

        } catch (error) {

            res.status(500).json({
                message: "Failed to fetch applications"
            });

        }

});

        app.post("/api/applications", async function(req, res) {

            try {

                const application = req.body;

                const result = await applications.insertOne(application);

                res.json({
                    message: "Application added successfully!",
                    id: result.insertedId
                });

            } catch (error) {

                res.status(500).json({
                    message: "Failed to add application"
                });

            }

        });

        app.get("/", function(req, res) {
            res.send("JobTrack Backend is running!");
        });

        app.listen(PORT, function() {
            console.log(`Server running on http://localhost:${PORT}`);
        });

    } catch (error) {

        console.log("Database connection failed!");
        console.log(error);

    }
}

startServer();