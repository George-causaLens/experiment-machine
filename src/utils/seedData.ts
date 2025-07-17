import { DataService } from '../services/dataService';

export const seedSampleData = async () => {
  try {
    console.log('Seeding sample data...');

    // Create sample blueprints
    const blueprint1 = await DataService.createBlueprint({
      name: 'Manufacturing COO Document Automation',
      description: 'Automate PDF categorization and document processing for Manufacturing COOs at large companies',
      industry: ['Manufacturing'],
      companySize: ['1001-5000 employees', '5001-10000 employees', '10000+ employees'],
      automation: 'PDF → Categorization automation',
      valueProposition: '$50M annual value through streamlined document processing',
      successRate: 85,
      avgRoi: 4.2,
      avgMeetingsBooked: 18,
      totalRevenue: 50000000,
      conversionRate: 22.5,
      tags: ['manufacturing', 'coo', 'document-automation', 'pdf-processing'],
      targetRoles: ['COO'],
      companyRevenue: ['$100M - $500M', '$500M - $1B', '$1B - $5B', '$5B - $10B', '$10B+'],
      painPoints: ['Operational efficiency', 'Process automation', 'Manual reporting'],
      usageCount: 15,
      relatedExperiments: []
    });

    const blueprint2 = await DataService.createBlueprint({
      name: 'Financial Services CTO Fraud Detection',
      description: 'Automate transaction monitoring and fraud detection for Financial Services CTOs',
      industry: ['Financial Services'],
      companySize: ['1001-5000 employees', '5001-10000 employees', '10000+ employees'],
      automation: 'Transaction → Fraud Detection',
      valueProposition: '$25M annual savings through automated fraud prevention',
      successRate: 78,
      avgRoi: 3.8,
      avgMeetingsBooked: 14,
      totalRevenue: 25000000,
      conversionRate: 18.2,
      tags: ['financial-services', 'cto', 'fraud-detection', 'transaction-monitoring'],
      targetRoles: ['CTO'],
      companyRevenue: ['$500M - $1B', '$1B - $5B', '$5B - $10B', '$10B+'],
      painPoints: ['Risk exposure', 'Manual underwriting', 'Fraud detection delays'],
      usageCount: 23,
      relatedExperiments: []
    });

    // Create sample ICP profiles
    const icp1 = await DataService.createICPProfile({
      name: 'Manufacturing COO - Large Companies',
      description: 'COOs at large manufacturing companies with $100M+ revenue',
      jobTitles: ['COO', 'Chief Operating Officer'],
      industries: ['Manufacturing', 'Industrial'],
      geographies: ['North America', 'United States'],
      companySizes: ['$100M+ revenue', '1001-5000 employees', '5001-10000 employees'],
      companyRevenue: ['$100M - $500M', '$500M - $1B', '$1B - $5B'],
      technologyStack: ['ERP Systems', 'Manufacturing Software', 'Supply Chain Management'],
      painPoints: ['Operational efficiency', 'Cost reduction', 'Process automation'],
      buyingAuthority: 'executive',
      tags: ['manufacturing', 'coo', 'large-companies', 'operational-efficiency'],
      usageCount: 15,
      relatedExperiments: []
    });

    // Create sample experiments
    const experiment1 = await DataService.createExperiment({
      name: 'Technical Pain Point LinkedIn - Manufacturing COOs',
      description: 'High response rate LinkedIn campaigns with technical pain point messaging for Manufacturing COOs',
      status: 'active',
      startedAt: new Date('2024-01-16'),
      endDate: new Date('2024-12-15'),
      blueprintId: blueprint1?.id || 'bp-001',
      outreachStrategy: 'LinkedIn Direct Message',
      messaging: 'Technical pain point messaging focused on document processing inefficiencies',
      content: 'LinkedIn Direct Message',
      distributionChannel: 'LinkedIn',
      targetAudience: 'Manufacturing COOs at $100M+ companies',
      variables: [
        { name: 'Target Role', value: 'COO', type: 'icp' },
        { name: 'Company Size', value: '$100M+ revenue', type: 'icp' },
        { name: 'Pain Point', value: 'Document processing inefficiencies', type: 'messaging' }
      ],
      successCriteria: {
        primaryGoal: 'meetings',
        targetMetrics: {
          meetingsBooked: 10,
          leadsGenerated: 15,
          responseRate: 8.0,
          roi: 3.0
        },
        timeFrame: 30,
        successThreshold: 80,
        secondaryGoals: ['High response rate', 'Quality leads']
      },
      integrationTracking: [
        {
          integrationId: 'linkedin-1',
          integrationName: 'LinkedIn Campaign Manager',
          integrationType: 'linkedin',
          campaignName: 'COO Document Automation Campaign',
          activityType: 'impressions',
          lastSync: new Date('2024-01-20'),
          isActive: true,
          config: { campaignId: 'li-campaign-001' }
        }
      ],
      metrics: {
        impressions: 1250,
        clicks: 89,
        conversions: 12,
        meetingsBooked: 8,
        cost: 450,
        roi: 1180,
        conversionRate: 13.5,
        ctr: 7.1,
        cpc: 5.1,
        cpm: 360
      },
      successScore: 85,
      tags: ['linkedin', 'coo', 'manufacturing', 'technical-pain-points'],
      icpProfileId: icp1?.id
    });

    console.log('Sample data created successfully!');
    return { blueprint1, blueprint2, icp1, experiment1 };
  } catch (error) {
    console.error('Error seeding data:', error);
    throw error;
  }
}; 