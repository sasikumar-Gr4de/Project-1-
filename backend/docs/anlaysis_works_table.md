```sql
-- Enable the uuid-ossp extension (run separately if permitted)
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Create the analysis_works table to track analysis tasks for matches
CREATE TABLE analysis_works (
  analysis_work_id UUID PRIMARY KEY DEFAULT uuid_generate_v4(), -- Unique identifier for each analysis task
  match_id UUID NOT NULL, -- Foreign key referencing the match being analyzed
  tagged_by UUID, -- Foreign key referencing the user who tagged/analyzed the match, nullable if unassigned
  progress DECIMAL(5,2) CHECK (progress >= 0 AND progress <= 100), -- Progress percentage of the analysis (0-100)
  rating DECIMAL(5,2) CHECK (rating >= 0 AND rating <= 100), -- Rating out of 100 for the analysis quality, nullable if not yet rated
  status VARCHAR(20) NOT NULL CHECK (status IN ('rejected', 'review', 'completed', 'approved')), -- Current status of the analysis
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP, -- Timestamp when the record was created
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP, -- Timestamp of the last update, managed by trigger
  notes TEXT, -- Additional comments or observations about the analysis
  FOREIGN KEY (match_id) REFERENCES matches(match_id) ON DELETE CASCADE, -- Cascade delete if match is removed
  FOREIGN KEY (tagged_by) REFERENCES users(id) ON DELETE SET NULL -- Set to NULL if the user is deleted
);

-- Create a trigger function to update updated_at
CREATE OR REPLACE FUNCTION update_analysis_works_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = CURRENT_TIMESTAMP; -- Automatically update the timestamp on each update
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create a trigger to call the function on update
CREATE TRIGGER update_analysis_works_updated_at
BEFORE UPDATE ON analysis_works
FOR EACH ROW
EXECUTE FUNCTION update_analysis_works_updated_at();
```
