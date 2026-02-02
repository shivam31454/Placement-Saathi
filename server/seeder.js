const mongoose = require('mongoose');
const dotenv = require('dotenv');
const Subject = require('./models/Subject');
const Topic = require('./models/Topic');

dotenv.config();

const connectDB = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        console.log('MongoDB Connected for Seeding...');
    } catch (err) {
        console.error(err);
        process.exit(1);
    }
};

const seedData = async () => {
    await connectDB();

    try {
        // Clear existing data
        await Subject.deleteMany({});
        await Topic.deleteMany({});
        console.log('Cleared existing Subjects and Topics...');

        // 1. Operating Systems
        const osSubject = await Subject.create({
            name: 'Operating Systems',
            description: 'Core concepts of OS including Process Management, Memory Management, and Concurrency.',
            icon: '💻'
        });

        const osTopics = [
            {
                title: 'Process Scheduling',
                subject: osSubject._id,
                content: `
# Process Scheduling

Process scheduling is an essential part of a Multiprogramming operating systems. Such operating systems allow more than one process to be loaded into the executable memory at a time and the loaded process shares the CPU using time multiplexing.

## Scheduling Algorithms
1. **First-Come, First-Served (FCFS)**: Simplest algo. Processes are executed in order of arrival.
2. **Shortest Job Next (SJN)**: Process with shortest execution time gets next.
3. **Round Robin (RR)**: Each process gets a fixed time slot (quantum).

### Important Terms
- **Arrival Time**: Time at which the process arrives in the ready queue.
- **Burst Time**: Time required by a process for CPU execution.
- **Turnaround Time**: Completion Time - Arrival Time.
                `,
                difficulty: 'Medium',
                order: 1
            },
            {
                title: 'Deadlocks',
                subject: osSubject._id,
                content: `
# Deadlocks

A deadlock is a situation in computing where two or more processes are blocked because each is waiting for the other to release a resource.

## Necessary Conditions (Coffman Conditions)
1. **Mutual Exclusion**: At least one resource must be held in a non-shareable mode.
2. **Hold and Wait**: A process must hold at least one resource and wait to acquire others.
3. **No Preemption**: Resources cannot be preempted.
4. **Circular Wait**: A set of processes are waiting for each other in a circular chain.
                `,
                difficulty: 'Hard',
                order: 2
            }
        ];

        // 2. DBMS
        const dbmsSubject = await Subject.create({
            name: 'DBMS',
            description: 'Database Management Systems, SQL, Normalization, and Transactions.',
            icon: '🗄️'
        });

        const dbmsTopics = [
            {
                title: 'ACID Properties',
                subject: dbmsSubject._id,
                content: `
# ACID Properties
To ensure data integrity, transactions in a database must adhere to ACID properties.

- **Atomicity**: All or nothing.
- **Consistency**: Database remains in a consistent state before and after transaction.
- **Isolation**: Meaning multiple transactions occur independently without interference.
- **Durability**: Changes of a successful transaction occur even if the system failure occurs.
                `,
                difficulty: 'Medium',
                order: 1
            },
            {
                title: 'Normalization',
                subject: dbmsSubject._id,
                content: `
# Normalization
Normalization is the process of organizing data in a database.

## Forms
- **1NF**: Atomic values.
- **2NF**: No partial dependency.
- **3NF**: No transitive dependency.
- **BCNF**: Review of 3NF.
                `,
                difficulty: 'Hard',
                order: 2
            }
        ];

        await Topic.insertMany([...osTopics, ...dbmsTopics]);

        console.log('✅ Data Imported Successfully!');
        process.exit();
    } catch (error) {
        console.error('❌ Error with data import:', error);
        process.exit(1);
    }
};

seedData();
