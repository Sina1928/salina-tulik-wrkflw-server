
1. Users, Industries, and Components are independent.
2. Users & Companies have a many-to-many relationship, so there is a user_company because companies have many users and users can belong to many companies
3. Companies belong to industries, so there is an industry_id in the companies table as a foreign key
4. Business requirements are related to industries so there is also an industry_id in the business requirements table
5. Components are related to business requirements there is also a business_requirements_components junction table
   ![db-relationships-diagram](db-relationships-diagram.png)
