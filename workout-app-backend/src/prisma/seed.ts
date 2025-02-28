/* eslint-disable @typescript-eslint/no-misused-promises */
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log('Seeding database...');

  await prisma.exercise.createMany({
    data: [
      {
        name: 'Push-up',
        description: 'Arm flexion exercise',
        category: 'STRENGTH',
        muscleGroup: 'CHEST',
        imageUrl:
          'https://asset.cloudinary.com/dxmwapxmo/2f790999047d160d59f0115272b47ac4',
        state: 'ACTIVE',
      },
      {
        name: 'Bench Press',
        description: 'Bench press with weights',
        category: 'STRENGTH',
        muscleGroup: 'CHEST',
        imageUrl:
          'https://asset.cloudinary.com/dxmwapxmo/b7f68af71f5f350756a230e8ac847824',
        state: 'ACTIVE',
      },
      {
        name: 'Incline Dumbbell Press',
        description: 'Dumbbell press on an incline bench',
        category: 'STRENGTH',
        muscleGroup: 'CHEST',
        imageUrl:
          'https://asset.cloudinary.com/dxmwapxmo/c8745cf1bf1f638bdc1cf860779cfc5d',
        state: 'ACTIVE',
      },

      {
        name: 'Pull-up',
        description: 'Bar pull-ups',
        category: 'STRENGTH',
        muscleGroup: 'BACK',
        imageUrl:
          'https://asset.cloudinary.com/dxmwapxmo/342d81651fa5dceb9e804b4605530585',
        state: 'ACTIVE',
      },
      {
        name: 'Deadlift',
        description: 'Deadlift with weights',
        category: 'STRENGTH',
        muscleGroup: 'BACK',
        imageUrl:
          'https://asset.cloudinary.com/dxmwapxmo/2286bfe0496c6b21cd32ca46a72c14f7',
        state: 'ACTIVE',
      },
      {
        name: 'Lat Pulldown',
        description: 'Machine-based exercise for back muscles',
        category: 'STRENGTH',
        muscleGroup: 'BACK',
        imageUrl:
          'https://asset.cloudinary.com/dxmwapxmo/9e847a21f2916781a8512e88aa81b97a',
        state: 'ACTIVE',
      },

      {
        name: 'Squat',
        description: 'Bodyweight squat',
        category: 'STRENGTH',
        muscleGroup: 'LEGS',
        imageUrl:
          'https://asset.cloudinary.com/dxmwapxmo/07e4e805356ef739193e3e84d67e377b',
        state: 'ACTIVE',
      },
      {
        name: 'Leg Press',
        description: 'Leg press machine exercise',
        category: 'STRENGTH',
        muscleGroup: 'LEGS',
        imageUrl:
          'https://asset.cloudinary.com/dxmwapxmo/3fa23531b47ca69644fc70c574281547',
        state: 'ACTIVE',
      },
      {
        name: 'Lunges',
        description: 'Walking lunges to strengthen legs',
        category: 'STRENGTH',
        muscleGroup: 'LEGS',
        imageUrl:
          'https://asset.cloudinary.com/dxmwapxmo/181f71244d51f2d16180a982c248de8a',
        state: 'ACTIVE',
      },

      // Cardio Exercises
      {
        name: 'Jump Rope',
        description: 'Jump rope for cardiovascular endurance',
        category: 'CARDIO',
        muscleGroup: 'LEGS',
        imageUrl:
          'https://asset.cloudinary.com/dxmwapxmo/5fcf0367dee49342dbfdbf237c77d66c',
        state: 'ACTIVE',
      },
      {
        name: 'Running',
        description: 'Outdoor or treadmill running',
        category: 'CARDIO',
        muscleGroup: 'LEGS',
        imageUrl:
          'https://asset.cloudinary.com/dxmwapxmo/bc3aca39e87a0f4baa866129de2545c9',
        state: 'ACTIVE',
      },
      {
        name: 'Cycling',
        description: 'Bicycle workout for endurance',
        category: 'CARDIO',
        muscleGroup: 'LEGS',
        imageUrl:
          'https://asset.cloudinary.com/dxmwapxmo/cde0d7e5869edbdccabf75f36ca16ee2',
        state: 'ACTIVE',
      },

      // Flexibility Exercises
      {
        name: 'Yoga Stretching',
        description: 'Full-body stretching routine',
        category: 'FLEXIBILITY',
        muscleGroup: 'CHEST',
        imageUrl:
          'https://asset.cloudinary.com/dxmwapxmo/92a80062bfdf207c12a978659a3b7325',
        state: 'ACTIVE',
      },
      {
        name: 'Hamstring Stretch',
        description: 'Stretch to improve hamstring flexibility',
        category: 'FLEXIBILITY',
        muscleGroup: 'LEGS',
        imageUrl:
          'https://asset.cloudinary.com/dxmwapxmo/c1e14f3b6e262b647c0fcad0008ae343',
        state: 'ACTIVE',
      },
      {
        name: 'Back Bridge',
        description: 'Bridge pose for back flexibility',
        category: 'FLEXIBILITY',
        muscleGroup: 'BACK',
        imageUrl:
          'https://asset.cloudinary.com/dxmwapxmo/1bee8a20bbe3c0244c01516a9dd4fe44',
        state: 'ACTIVE',
      },
    ],
  });

  console.log('✅ Seeding completed!');
}

// Ejecuta el seeder y maneja errores
main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
