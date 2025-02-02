'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';
import { toast } from '@/components/ui/use-toast';

type StudentProfileData = {
  name: string;
  email: string;
  phone: string;
  emergencyContact: {
    name: string;
    phone: string;
    relationship: string;
  };
  medicalInfo: string;
  preferences: {
    preferredDays: string[];
    maxLessonsPerWeek: number;
  };
};

export function StudentProfile() {
  const [profile, setProfile] = useState<StudentProfileData>({
    name: '',
    email: '',
    phone: '',
    emergencyContact: {
      name: '',
      phone: '',
      relationship: '',
    },
    medicalInfo: '',
    preferences: {
      preferredDays: [],
      maxLessonsPerWeek: 3,
    },
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      // API call would go here
      toast({
        title: 'Profile Updated',
        description: 'Your profile has been successfully updated.',
      });
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to update profile. Please try again.',
        variant: 'destructive',
      });
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-8">
      <Card>
        <CardHeader>
          <CardTitle>Personal Information</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="name">Full Name</Label>
              <Input
                id="name"
                value={profile.name}
                onChange={(e) => setProfile({ ...profile, name: e.target.value })}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                value={profile.email}
                onChange={(e) => setProfile({ ...profile, email: e.target.value })}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="phone">Phone</Label>
              <Input
                id="phone"
                value={profile.phone}
                onChange={(e) => setProfile({ ...profile, phone: e.target.value })}
              />
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Emergency Contact</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="emergencyName">Contact Name</Label>
              <Input
                id="emergencyName"
                value={profile.emergencyContact.name}
                onChange={(e) => setProfile({
                  ...profile,
                  emergencyContact: { ...profile.emergencyContact, name: e.target.value },
                })}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="emergencyPhone">Contact Phone</Label>
              <Input
                id="emergencyPhone"
                value={profile.emergencyContact.phone}
                onChange={(e) => setProfile({
                  ...profile,
                  emergencyContact: { ...profile.emergencyContact, phone: e.target.value },
                })}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="relationship">Relationship</Label>
              <Input
                id="relationship"
                value={profile.emergencyContact.relationship}
                onChange={(e) => setProfile({
                  ...profile,
                  emergencyContact: { ...profile.emergencyContact, relationship: e.target.value },
                })}
              />
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Medical Information</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            <Label htmlFor="medicalInfo">Relevant Medical Information</Label>
            <Textarea
              id="medicalInfo"
              value={profile.medicalInfo}
              onChange={(e) => setProfile({ ...profile, medicalInfo: e.target.value })}
              placeholder="Please list any medical conditions, allergies, or other important health information."
              className="h-32"
            />
          </div>
        </CardContent>
      </Card>

      <div className="flex justify-end">
        <Button type="submit" size="lg">
          Save Changes
        </Button>
      </div>
    </form>
  );
}