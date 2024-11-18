module.exports = {
    name: 'calculator',
    description: 'Basic calculator, addition, subtraction. multiplication, division',
    options: [
      {
        name: 'number1',
        description: 'The first number',
        type: 10,
        required: true,
      },
      {
        name: 'number2',
        description: 'The second number',
        type: 10,
        required: true,
      },
      {
        name: 'operation',
        description: 'The operation to perform (add, subtract, multiply, divide)',
        type: 3,
        required: true,
        choices: [
          {
            name: 'Add',
            value: 'add',
          },
          {
            name: 'Subtract',
            value: 'subtract',
          },
          {
            name: 'Multiply',
            value: 'multiply',
          },
          {
            name: 'Divide',
            value: 'divide',
          },
        ],
      },
    ],
  
    callback: async (client, interaction) => {
      await interaction.deferReply();
  

      const number1 = interaction.options.getNumber('number1');
      const number2 = interaction.options.getNumber('number2');
      const operation = interaction.options.getString('operation');
  
      let result;
  
      switch (operation) {
        case 'add':
          result = number1 + number2;
          break;
        case 'subtract':
          result = number1 - number2;
          break;
        case 'multiply':
          result = number1 * number2;
          break;
        case 'divide':
          if (number2 === 0) {
            return interaction.editReply('Error: Cannot divide by zero.');
          }
          result = number1 / number2;
          break;
        default:
          return interaction.editReply('Invalid operation selected.');
      }
  
      interaction.editReply(`**${result}**`);
    },
  };
  