USE [comrel_master]
GO

/****** Object:  Table [dbo].[request_logs]    Script Date: 7/11/2025 9:08:30 AM ******/
SET ANSI_NULLS ON
GO

SET QUOTED_IDENTIFIER ON
GO

CREATE TABLE [dbo].[request_logs](
	[id_master] [int] IDENTITY(1,1) NOT NULL,
	[request_id] [int] NOT NULL,
	[request_status] [varchar](100) NULL,
	[comm_Category] [varchar](255) NULL,
	[comm_Area] [varchar](255) NULL,
	[comm_Act] [varchar](255) NULL,
	[time_date] [datetime] NULL,
	[changes_made] [nvarchar](max) NULL,
PRIMARY KEY CLUSTERED 
(
	[id_master] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
) ON [PRIMARY] TEXTIMAGE_ON [PRIMARY]
GO

ALTER TABLE [dbo].[request_logs] ADD  DEFAULT (getdate()) FOR [time_date]
GO


