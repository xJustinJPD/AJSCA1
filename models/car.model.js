const { Schema, model } = require('mongoose');

// Model for the car object

const carSchema = Schema(
    {
        make: {
            type: String,
            required: [true, 'make field is required'],
        },
        model: {
            type: String,
            required: [true, 'model field is required'],
        },
        year: {
            type: Number,
            required: [true, 'year field is required'],
        },
        image_path: {
            type: String
        },
        user_id: {
            type: String,
            required: true,
            required: false
        },
        // deleted tag for soft delete
        deleted: {
            type: Boolean,
            default: false,
            required: false
        },
        // many to many mechanics relationship
        mechanics: [{
                type: Schema.Types.ObjectId,
                ref: 'Mechanic',
        }
        ],
        // one to many drivers relationship, drivers only have one car, cars have 2 or more drivers
        drivers: [{
            type: Schema.Types.ObjectId,
            ref: 'Driver',
    }
    ]
    },
    { timestamps: true }
);

module.exports = model('Car', carSchema);