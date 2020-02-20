
exports.seed = function(knex) {
  // Inserts seed entries
  return knex('category').insert([
    {name: 'Bank Fees'},
    {name: 'Cash Advance'},
    {name: 'Community'},
    {name: 'Education'},
    {name: 'Law Enforcement'},
    {name: 'Religious' },
    {name: 'Food and Drink' },
    {name: 'Healthcare' },
    {name: 'Interest' },
    {name: 'Payment' },
    {name: 'Recreation' },
    {name: 'Service' },
    {name:"Automotive" },
    {name:"Cable" },
    {name:"Construction" },
    {name:"Financial" },
    {name:"Home Improvement" },
    {name:"Internet Services" },
    {name:"Utilities" },
    {name:"Shops" },
    {name:"Tax" },
    {name:"Transfer" },
    {name:"Travel" },
    {name:"Real Estate" }
  ]);
};
