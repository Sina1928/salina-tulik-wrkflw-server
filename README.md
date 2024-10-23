1. Users & Companies have a many-to-many relationship, so there is a user_company because companies have many users and users can belong to many companies
2. Companies belong to industries, so there is an industry_id in the companies table as a foreign key
3. Business requirements are related to industries so there is also an industry_id in the business requirements table
4. Components are related to business requirements there is also a business_requirements_components junction table
   ![db-relationships-diagram](db-relationships-diagram.png)
