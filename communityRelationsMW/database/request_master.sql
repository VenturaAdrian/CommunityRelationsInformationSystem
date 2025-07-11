USE [comrel_master]
GO

/****** Object:  Table [dbo].[request_master]    Script Date: 7/11/2025 9:09:02 AM ******/
SET ANSI_NULLS ON
GO

SET QUOTED_IDENTIFIER ON
GO

CREATE TABLE [dbo].[request_master](
	[request_id] [int] IDENTITY(1,1) NOT NULL,
	[request_status] [varchar](255) NULL,
	[comment_id] [varchar](255) NULL,
	[upload_id] [varchar](255) NULL,
	[comm_Area] [varchar](255) NULL,
	[comm_Act] [varchar](255) NULL,
	[date_Time] [varchar](255) NULL,
	[comm_Venue] [varchar](255) NULL,
	[comm_Guest] [varchar](255) NULL,
	[comm_Docs] [varchar](max) NULL,
	[comm_Emps] [varchar](255) NULL,
	[comm_Benef] [varchar](255) NULL,
	[comm_Desc] [varchar](max) NULL,
	[comm_Category] [varchar](255) NULL,
	[comrelofficer] [bit] NULL,
	[comrelthree] [bit] NULL,
	[comreldh] [bit] NULL,
	[is_active] [bit] NULL,
	[created_by] [varchar](255) NULL,
	[created_at] [varchar](255) NULL,
	[updated_by] [varchar](255) NULL,
	[updated_at] [varchar](255) NULL,
PRIMARY KEY CLUSTERED 
(
	[request_id] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
) ON [PRIMARY] TEXTIMAGE_ON [PRIMARY]
GO


