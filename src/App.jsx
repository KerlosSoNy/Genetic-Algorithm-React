import React, { useState } from 'react';

function GeneticAlgorithmComponent() {
    const [bestFitness, setBestFitness] = useState(null);
    const [bestRealScheduling, setBestRealScheduling] = useState(null);
    const [romes , setRomes] = useState(null);
    const [showRoom,setShowRoom]=useState();
    const [data,setData]= useState();
    // Define genetic algorithm function
    function runGeneticAlgorithm() {
        // Load data from CSV (Assuming participants_data is already populated with data)
let participants_data = ['Ahmed','Mohamed','Sayed','Ali','Osama','Ahmed','Mohamed','Sayed','Ali','Osama','Ahmed','Mohamed','Sayed','Ali','Osama']; // Assume this is your participants data in array format
let rooms_data = romes;

// Define the objective function
function objective_function(solution, participants_data, rooms_data) {
    // Initialize fitness score
    let fitness = 0;

    // Decode the solution to assign participants to rooms
    let rooms_assigned = {};
    for (let i = 0; i < solution.length; i++) {
        let room = solution[i];
        if (!(room in rooms_assigned)) {
            rooms_assigned[room] = [];
        }
        rooms_assigned[room].push(participants_data[i]); // Pushing the participant name
    }

    // Calculate fitness based on the assigned rooms
    for (let room in rooms_assigned) {
        // Example fitness calculation: maximize the number of participants in each room
        fitness += rooms_assigned[room].length;
    }

    return fitness;
}

// Genetic Algorithm
function genetic_algorithm(participants_data, rooms_data, population_size=100, generations=100, mutation_rate=0.1) {
    // Initialize population
    let population = [];
    for (let i = 0; i < population_size; i++) {
        let individual = [];
        for (let j = 0; j < participants_data.length; j++) {
            individual.push(Math.floor(Math.random() * rooms_data));
        }
        population.push(individual);
    }

    // Best solution found so far
    let best_solution = null;
    let best_fitness = Number.NEGATIVE_INFINITY;

    // Evolution loop
    for (let generation = 0; generation < generations; generation++) {
        // Evaluate fitness for each individual in the population
        let fitness_scores = population.map(individual => objective_function(individual, participants_data, rooms_data));

        // Find the best individual in this generation
        let max_fitness_index = fitness_scores.indexOf(Math.max(...fitness_scores));
        let current_best_fitness = fitness_scores[max_fitness_index];
        let current_best_solution = population[max_fitness_index];

        // Check if we have a new overall best solution
        if (current_best_fitness > best_fitness) {
            best_fitness = current_best_fitness;
            best_solution = current_best_solution.slice(); // Make a copy of the best solution
        }

        // Selection: simple tournament selection
        let selected_indices = [];
        for (let i = 0; i < population_size; i++) {
            selected_indices.push(Math.floor(Math.random() * population_size));
        }

        // Crossover: single point crossover
        let offspring = [];
        for (let i = 0; i < population_size; i += 2) {
            let parent1 = population[selected_indices[i]].slice();
            let parent2 = population[selected_indices[i + 1]].slice();

            let crossover_point = Math.floor(Math.random() * participants_data.length);
            let child1 = parent1.slice(0, crossover_point).concat(parent2.slice(crossover_point));
            let child2 = parent2.slice(0, crossover_point).concat(parent1.slice(crossover_point));

            offspring.push(child1);
            offspring.push(child2);
        }

        // Mutation: bit flip mutation
        for (let i = 0; i < population_size; i++) {
            if (Math.random() < mutation_rate) {
                let mutate_point = Math.floor(Math.random() * participants_data.length);
                offspring[i][mutate_point] = Math.floor(Math.random() * rooms_data);
            }
        }

        // Replace the old population with the new offspring
        population = offspring.slice();
    }

    // Decode the best solution to get the best real scheduling
    let best_real_scheduling = {};
    for (let i = 0; i < best_solution.length; i++) {
        let room = best_solution[i];
        if (!(room in best_real_scheduling)) {
            best_real_scheduling[room] = [];
        }
        best_real_scheduling[room].push(participants_data[i]); // Pushing the participant name
    }
    setData(best_real_scheduling)
    return [best_fitness, best_real_scheduling];
}

// Run the genetic algorithm
let [best_fitness, best_real_scheduling] = genetic_algorithm(participants_data, rooms_data, 4, 200);

console.log("Best Fitness:", best_fitness);
console.log("Best Real Scheduling:");
for (let room in best_real_scheduling) {

    console.log("Room", room, ":", best_real_scheduling[room]);
}
}
console.log(data)
    return (
        <div>
            <h1>Genetic Algorithm</h1>
            <label htmlFor="input">
              <span>
              Enter Rooms Count:
              </span>
              <input type="number" id="input" value={romes || 0} onChange={(e) => setRomes(e.target.value)} />
            </label>
            <button onClick={runGeneticAlgorithm}>Run Algorithm</button>
            { Array.isArray(data) && 
                data?.map((e, index)=>{
                  console.log(e)
                  return(
                    <div key={index}>
                      <h1>Room {index+1}</h1>
                    </div>
                  )
                })
            }
        </div>
    );
}

export default GeneticAlgorithmComponent;
